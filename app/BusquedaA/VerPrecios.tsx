/* eslint-disable @next/next/no-page-custom-font */

import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';

type Filters = {
    directFlight: boolean;
    price: boolean;
    duration: boolean;
};

const VerPrecios: NextPage<VerPreciosProps> = ({ originCity, destinationCity, adults, child, infants,}) => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [showPrices, setShowPrices] = useState(true);
    const [sortedFlights, setSortedFlights] = useState<Flight[]>([]);
    const [filters, setFilters] = useState<Filters>({
        directFlight: false,
        price: false,
        duration: false,
    });
    const [activeFilters, setActiveFilters] = useState<(keyof Filters)[]>([]);
    const [selectedFlightIndex, setSelectedFlightIndex] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showPricePanel, setShowPricePanel] = useState<boolean>(true);
    const [selectedPriceType, setSelectedPriceType] = useState<string | null>(null);

    const [selectedFlightDetails, setSelectedFlightDetails] = useState<{
        flight: Flight | null;
        departureTime: string | null;
        arrivalTime: string | null;
        price: number | null;
        typeFlight: string | null;
    }>({ flight: null, departureTime: null, arrivalTime: null, price: null, typeFlight: null });
    
    useEffect(() => {
        fetch('https://65f0ba68da8c6584131c57f7.mockapi.io/api/city/flights')
            .then(response => response.json())
            .then(data => {
                setFlights(data);
                setSortedFlights(data);
            })
            .catch(error => console.error('Error fetching flights:', error));
    }, []);

    const handleSortByPrice = () => {
        const sorted = [...flights].sort((a, b) => a.precio - b.precio);
        setSortedFlights(sorted);
        toggleFilter('price');
    };

    const handleSortByDirectFlight = () => {
        const sorted = [...flights].sort((a, b) => {
            if (a.tipo_vuelo === 'Directo') return -1;
            if (a.tipo_vuelo === '1 Escala' && b.tipo_vuelo === '2 Escalas') return -1;
            return 1;
        });
        setSortedFlights(sorted);
        toggleFilter('directFlight');
    };

    const handleShowPanelPrice = () => {
        setShowPricePanel(false);
    };

    const handleSortByDuration = () => {
        const sorted = [...flights].sort((a, b) => {
            const durationA = calculateDuration(a.hora_ida, a.hora_vuelta);
            const durationB = calculateDuration(b.hora_ida, b.hora_vuelta);
            return durationA - durationB;
        });
        setSortedFlights(sorted);
        toggleFilter('duration');
    };

    const calculateDuration = (departureTime: string, arrivalTime: string): number => {
        const [departureHours, departureMinutes] = departureTime.split(':').map(Number);
        const [arrivalHours, arrivalMinutes] = arrivalTime.split(':').map(Number);
    
        let departureInMinutes = departureHours * 60 + departureMinutes;
        let arrivalInMinutes = arrivalHours * 60 + arrivalMinutes;
    
        // Si la hora de llegada es menor que la hora de salida, se asume que la llegada es al día siguiente
        if (arrivalInMinutes < departureInMinutes) {
            arrivalInMinutes += 24 * 60; // Suma 24 horas en minutos
        }
    
        return arrivalInMinutes - departureInMinutes;
    };

    const toggleFilter = (filter: keyof Filters) => {
        setFilters(prevFilters => ({ ...prevFilters, [filter]: !prevFilters[filter] }));
        setActiveFilters(prevFilters => {
            if (prevFilters.includes(filter)) {
                return prevFilters.filter(activeFilter => activeFilter !== filter);
            } else {
                return [...prevFilters, filter];
            }
        });
    };


    const handleFlightTypeClick = (index: number) => {
        const selectedFlight = sortedFlights[index];
        const departureTime = selectedFlight.hora_ida;
        const arrivalTime = selectedFlight.hora_vuelta;
        const price = selectedFlight.precio;
        const typeFlight = selectedFlight.tipo_vuelo;
        
        setSelectedFlightIndex(index);
        setSelectedFlightDetails({ flight: selectedFlight, departureTime, arrivalTime, price, typeFlight});
        
    };

    const handleSelectExecutivePrice = (typePrice: string) => {
        if (selectedFlightIndex !== null) {
            const selectedFlight = sortedFlights[selectedFlightIndex];
            const departureTime = selectedFlight.hora_ida;
            const arrivalTime = selectedFlight.hora_vuelta;
            let price = selectedFlight.precio;
            const typeFlight = selectedFlight.tipo_vuelo;    
            setSelectedFlightDetails({ flight: selectedFlight, departureTime, arrivalTime, price, typeFlight });
            setSelectedPriceType(typePrice);
        }

    };

    const calculateTotalPrice = (tipoVuelo: string): number | null => {
        if (selectedFlightIndex === null) {
            return null; // No hay vuelo seleccionado, devuelve null
        }
        let precioBase = selectedFlightDetails.price; // Precio base del vuelo

        if (precioBase === null) {
            return null;
        }
        // Multiplicar el precio base por 2 si es ejecutivo
        if (tipoVuelo === 'ejecutivo') {
            return precioBase * 2;
        }
        return precioBase; // Para tipo de vuelo económico, retorna el precio base
    };
    
    
    const handleActiveFilterClick = (filter: keyof Filters) => {
        toggleFilter(filter);
        const remainingFilters = activeFilters.filter(activeFilter => activeFilter !== filter);
        let sorted = [...flights];
        remainingFilters.forEach(activeFilter => {
            switch (activeFilter) {
                case 'price':
                    sorted = sorted.sort((a, b) => a.precio - b.precio);
                    break;
                case 'directFlight':
                    sorted = sorted.sort((a, b) => {
                        if (a.tipo_vuelo === 'Directo') return -1;
                        if (a.tipo_vuelo === '1 Escala' && b.tipo_vuelo === '2 Escalas') return -1;
                        return 1;
                    });
                    break;
                case 'duration':
                    sorted = sorted.sort((a, b) => {
                        const durationA = calculateDuration(a.hora_ida, a.hora_vuelta);
                        const durationB = calculateDuration(b.hora_ida, b.hora_vuelta);
                        return durationA - durationB;
                    });
                    break;
                default:
                    break;
            }
        });
        setSortedFlights(sorted);
    };

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=optional" />
            {showPrices && (
                <div className="flight-header-container">
                    <div className="flight-header">
                        <div className="special-logo-container">
                            <div className="flight-header-filter">
                                <span className="material-symbols-outlined">flight_takeoff</span>
                            </div>
                            <div className="flight-header-text">
                                Viaje de {originCity} a {destinationCity} - Dom, Mar 14, 2024
                            </div>
                        </div>
                        <div className="flight-header-filter">
                            <span className="material-symbols-outlined">filter_alt</span>
                            <span>Recomendado:</span>
                            <button className={`filter-button ${filters.directFlight ? 'active' : ''}`} onClick={handleSortByDirectFlight}>
                                Vuelo Directo
                            </button>
                            <button className={`filter-button ${filters.price ? 'active' : ''}`} onClick={handleSortByPrice}>
                                Mejor Precio
                            </button>
                            <button className={`filter-button ${filters.duration ? 'active' : ''}`} onClick={handleSortByDuration}>
                                Duración
                            </button>
                        </div>
                    </div>
                </div>
            )}  

        <div className="active-filters-header">
            <span className="active-filters-title">Filtros Aplicados:</span>
            {activeFilters.map((filter, index) => (
                <div key={index} className="active-filter" onClick={() => handleActiveFilterClick(filter)}>
                {filter === 'directFlight' && 'Vuelo Directo'}
                {filter === 'price' && 'Mejor Precio'}
                {filter === 'duration' && 'Duración'}
                </div>
            ))}
            </div>

    <div className="container">
        {sortedFlights.map((flight, index) => (
            
            <div key={index} className="flight-option" style={{ marginBottom: '20px', position: 'relative'}}>
        <div className="best-price">MEJOR PRECIO</div>
        <div>
            <div className="departure-time">{flight.hora_ida}</div>
            <div className="airport-codes">{originCity}</div>
        </div>
        <div className="flight-separator">
            <div className="flight-separator.left"></div>
        </div>
        <div className="flex items-center justify-center">
            <div>

        <button 
            onClick={() => {
                handleFlightTypeClick(index);
                setShowPricePanel(true);
            }}
            style={{backgroundColor: 'transparent'}}
        >
            {flight.tipo_vuelo}
        </button>
            </div>
            <span className="material-symbols-outlined">flight_takeoff</span>
        </div>
        <div className="flight-separator">
            <div className="flight-separator.left"></div>
        </div>
        <div>
            <div className="arrival-time">{flight.hora_vuelta}</div>
            <div className="airport-codes">{destinationCity}</div>
        </div>
        <div>
            <div className="price">
                <div className="left-border"></div>
                {flight.precio} COP
            </div>
        </div>
        
    {selectedFlightIndex !== null &&  showPricePanel &&(
    <div className="modal" style = {{backgroundColor: 'rgba(0, 0, 0, 0)', backdropFilter: 'blur(1px)'}}>
        <div className="modal-content" style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', zIndex: 999 }}>
        {!showModal && (
            <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h2 style={{ fontWeight: 'bold', fontSize: '1.4em', textAlign: 'center', margin: '0 auto' }}>Selecciona el tipo de precio:</h2>
<button style={{ background: 'transparent', border: 'none', fontWeight: 'bold', marginTop: '10px' }} onClick={handleShowPanelPrice}>X</button>

            <div style={{ width: '50px' }}></div> {/* Espacio para centrar el texto */}
        </div>
            <div className="price-options">
                <div className="price-option" style={{ backgroundColor: '#C2DCFC'}}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.4em' }}>Precio Económico</h3>
                    <ul>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <span className="material-symbols-outlined trips-icon" style={{ marginRight: '20px' }}>your_trips</span>
            <div>
                <span style={{ fontWeight: 'bold' }}>1 Articulo Personal (Bolso)</span>
                <div>
                    <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>Debe caber debajo del asiento</span>
                </div>
            </div>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span className="material-symbols-outlined trips-icon" style={{ marginRight: '20px' }}>trip</span>
            <div>
                <span style={{ fontWeight: 'bold' }}>1 Equipaje de Mano (10kg)</span>
                <div>
                    <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>Desde $80.000</span>
                </div>
            </div>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span className="material-symbols-outlined trips-icon" style={{ marginRight: '20px' }}>luggage</span>
            <div>
                <span style={{ fontWeight: 'bold' }}>Equipaje de Bodega (23kg)</span>
                <div>
                    <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>Desde $100.000</span>
                </div>
            </div>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span className="material-symbols-outlined trips-icon" style={{ marginRight: '30px' }}>event_available</span>
            <div>
                <span style={{ fontWeight: 'bold' }}>Check-In en Aeropuerto</span>
                <div>
                    <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>Cargo adicional</span>
                </div>
            </div>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span className="material-symbols-outlined trips-icon" style={{ marginRight: '35px' }}>volunteer_activism</span>
            <div>
                <span style={{ fontWeight: 'bold' }}>Acumula Millas</span>
                <div>
                    <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>No disponible con el plan</span>
                </div>
            </div>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span className="material-symbols-outlined trips-icon" style={{ marginRight: '35px' }}>currency_exchange</span>
            <div>
                <span style={{ fontWeight: 'bold' }}>Reembolso</span>
                <div>
                    <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>No disponible con el plan</span>
                </div>
            </div>
        </li>
    
                    </ul>
                    
                    <button 
                        className="confirm-button-price" 
                        onClick={() => {
                            const selectedFlight = sortedFlights[selectedFlightIndex];
                            {handleSelectExecutivePrice("economico")}
                            setShowModal(true); // Establece showModal en true
                        }}
                    >
                        {calculateTotalPrice("economico")} COP
                    </button>

                    <h3 style={{fontSize: '0.9em' }}>Precio por Pasajero</h3>
                </div>


                <div className="price-option" style={{ backgroundColor: '#F5F094'}}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.4em' }}>Precio Ejecutivo</h3>


                    <ul>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="material-symbols-outlined trips-icon" style={{ marginRight: '23px' }}>your_trips</span>
                    
                    <div>
                        <span style={{ fontWeight: 'bold' }}>1 Articulo Personal (Bolso)</span>
                        <div>
                            <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>Debajo del asiento</span>
                        </div>
                    </div>
                </li>

                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="material-symbols-outlined trips-icon" style={{ marginRight: '23px' }}>trip</span>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>1 Equipaje de Mano (10kg)</span>
                        <div>
                            <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>En el compartimiento superior</span>
                        </div>
                    </div>
                </li>

                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="material-symbols-outlined trips-icon" style={{ marginRight: '23px' }}>luggage</span>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>Equipaje de Bodega (23kg)</span>
                        <div>
                            <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>Entrega el equipaje en el counter</span>
                        </div>
                    </div>
                </li>

                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="material-symbols-outlined trips-icon" style={{ marginRight: '50px' }}>airline_seat_recline_extra</span>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>Asiento Plus</span>
                        <div>
                            <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>Sujeto a disponibilidad</span>
                        </div>
                    </div>
                </li>

                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="material-symbols-outlined trips-icon" style={{ marginRight: '45px' }}>connecting_airports</span>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>Cambios de Vuelo</span>
                        <div>
                            <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>Sin cargo antes del vuelo</span>
                        </div>
                    </div>
                </li>

                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="material-symbols-outlined trips-icon" style={{ marginRight: '40px' }}>currency_exchange</span>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>Reembolso</span>
                        <div>
                            <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>Permitido antes del vuelo</span>
                        </div>
                    </div>
                </li>
            </ul>
                    <button 
                        className="confirm-button-price" 
                        onClick={() => {
                            const selectedFlight = sortedFlights[selectedFlightIndex];
                            {handleSelectExecutivePrice("ejecutivo")}
                            setShowModal(true); // Establece showModal en true
                        }}
                    >
                        {calculateTotalPrice("ejecutivo")} COP
                    </button>
                
                    <h3 style={{fontSize: '0.9em' }}>Precio por Pasajero</h3>
                </div>
                
            </div>  
        </>
    )}

{selectedFlightDetails  && showModal && (
    <div className="container">     
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Resumen del Vuelo:</h1>
        <span className="material-symbols-outlined trips-icon" style={{ marginRight: '5px', marginLeft:'20px' }}>flight</span>
        Id del Vuelo: #SA154
        <span style={{ marginLeft: '160px' }}>
        <span style={{ verticalAlign: 'middle', marginRight: '5px' }} className="material-symbols-outlined">flightsmode</span>
        <span style={{ verticalAlign: 'middle' }}>Aerolínea: Singapur Airlines</span>

        </span>

        <br></br>
        <span className="material-symbols-outlined trips-icon" style={{ marginRight: '10px', verticalAlign: 'middle', marginLeft:'20px' }}>family_restroom</span>
        <span style={{ marginRight: '10px', verticalAlign: 'middle' }}>Número de Pasajeros:</span>
        <span style={{ verticalAlign: 'middle' }}>
        <span style={{ marginLeft: '10px', marginRight: '13px' }}>👨🏻‍🦱</span>
        <span style={{ marginRight: '24px' }}>Adultos: {adults}</span>
        <span style={{ marginRight: '13px' }}>👦</span>
        <span style={{ marginRight: '24px' }}>Niños: {child}</span>
        <span style={{ marginRight: '13px' }}>👶</span>
        <span style={{ marginRight: '24px' }}>Bebés: {infants}</span>

        </span>

        <div key={index} className="flight-option" style={{ marginBottom: '20px', position: 'relative'}}>
            <div>
                <div className="departure-time">{selectedFlightDetails.departureTime}</div>
                <div className="airport-codes">{originCity}</div>
            </div>
            <div className="flight-separator">
                <div className="flight-separator.left"></div>
            </div>
            <div className="flex items-center justify-center">
                <div>{selectedFlightDetails.typeFlight}</div>
                <span className="material-symbols-outlined" style={{ marginLeft: '18px' }}>flight_takeoff</span>
            </div>
            <div className="flight-separator">
                <div className="flight-separator.left"></div>
            </div>
            <div>
                <div className="arrival-time">{selectedFlightDetails.arrivalTime}</div>
                <div className="airport-codes">{destinationCity}</div>
            </div>
            <div>
                <div className="price">
                    <div className="left-border"></div>
                    {selectedPriceType === "ejecutivo" ? calculateTotalPrice("ejecutivo") : calculateTotalPrice("economico")} COP
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button style={{ borderRadius: '20px', backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }} onClick={() => setShowModal(false)}>Editar Selección</button>
            <button style={{ borderRadius: '20px', backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Confirmar Vuelo</button>
        </div>
    </div>
)}


        </div>
    </div>
)}

    </div>
))}

            </div>

            <div style={{ height: '50px' }} />
        </div>
    );
};



export default VerPrecios;