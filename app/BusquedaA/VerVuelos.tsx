/* eslint-disable @next/next/no-page-custom-font */

"use client";
import React, { useState, useEffect } from 'react';
import type { City } from '../types/city';
import VerPrecios from './VerPrecios'; // Importa el componente VerPrecios
import logo from '../components/BusquedaA/Icons/airplane.png';
import beach from '../components/BusquedaA/Icons/beach.png';
import '../styles/BusquedaA/styles.css';
import Image from 'next/image';

export default function VerVuelos() {
  const [cities, setCities] = useState<City[]>([]);
  const [showPrices, setShowPrices] = useState(false); // Estado para controlar la visibilidad de VerPrecios
  const [tripType, setTripType] = useState('roundTrip'); // Estado para controlar el tipo de viaje
  const [originCity, setOriginCity] = useState(''); // Estado para almacenar la ciudad de origen
  const [destinationCity, setDestinationCity] = useState(''); // Estado para almacenar la ciudad de destino
  const [filteredCities, setFilteredCities] = useState<City[]>([]); // Estado para almacenar las ciudades filtradas
  const [showMainButtons, setShowMainButtons] = useState(true); // Estado para mostrar los botones principales
  const [originCityFilled, setOriginCityFilled] = useState(false); // Estado para indicar si el campo de origen está lleno
  const [destinationCityFilled, setDestinationCityFilled] = useState(false); // Estado para indicar si el campo de destino está lleno
  const [showModifySearch, setShowModifySearch] = useState(false); // Estado para controlar la visibilidad del botón "Modificar Búsqueda"
  const [selectedOriginCity, setSelectedOriginCity] = useState('');
  const [selectedDestinationCity, setSelectedDestinationCity] = useState('');
  const [showPassengerSelection, setShowPassengerSelection] = useState(false);
  const [adults, setAdults] = useState(1);
  const [child, setChild] = useState(0);
  const [infants, setInfants] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [passengerSelectionConfirmed, setPassengerSelectionConfirmed] = useState(false);
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [departureDate, setDepartureDate] = useState('2024-03-15');
  const [returnDate, setReturnDate] = useState('2024-03-18');


  useEffect(() => {
    fetch('https://65f0ba68da8c6584131c57f7.mockapi.io/api/city/cities')
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
        setFilteredCities(data); // Inicialmente, muestra todas las ciudades disponibles
      })
      .catch((error) => console.error('Error fetching cities:', error));
  }, []);

  useEffect(() => {
    // Filtra las ciudades disponibles para el destino
    const filteredDestinationCities = cities.filter(
      (city) => city.city.toLowerCase() !== originCity.toLowerCase()
    );
    setFilteredCities(filteredDestinationCities);
  }, [originCity, cities]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (originCityFilled && destinationCityFilled && passengerSelectionConfirmed) {
      setShowPrices(true);
      setShowMainButtons(false);
      setShowModifySearch(true);
      setShowModifyForm(true);
      const searchEntry = `${originCity} -> ${destinationCity} • ${departureDate} -> ${returnDate} • Pasajeros: ${adults + child + infants}`;      setSearchHistory([...searchHistory, searchEntry]); // Agregar al historial
      // Pasar las ciudades seleccionadas como props a VerPrecios
      setShowPrices(true);
      setShowMainButtons(false);
      setShowModifySearch(true);
    } else {
      let errorMessage = "";
    if (!originCityFilled) {
      errorMessage += "Por favor, complete el campo de origen.\n";
    }
    if (!destinationCityFilled) {
      errorMessage += "Por favor, complete el campo de destino.\n";
    }
    if (!passengerSelectionConfirmed) {
      errorMessage += "Por favor, confirme la selección de pasajeros.\n";
    }
    alert(errorMessage);
    }
  };

  const togglePassengerSelection = () => {
    setShowPassengerSelection(!showPassengerSelection);
  };

  const handleRemoveEntry = (indexToRemove: number) => {
    setSearchHistory(prevHistory => prevHistory.filter((_, index) => index !== indexToRemove));
  };

  const handleAdultChange = (newValue: number) => {
    setAdults(newValue);
  };

  const handleChildrenChange = (newValue: number) => {
    setChild(newValue);
  };

  const handleInfantsChange = (newValue: number) => {
    setInfants(newValue);
  };

  const handleConfirm = () => {
    setShowPassengerSelection(false); // Oculta el cuadro de selección de pasajeros al confirmar
    setPassengerSelectionConfirmed(true)
  };

const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setOriginCity(value);
  setOriginCityFilled(value !== '');

  // Sincronizar selectedOriginCity con originCity
  if (value === destinationCity) {
      setDestinationCity('');
      setDestinationCityFilled(false);
  } else {
      setSelectedOriginCity(value);
  }
}

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDestinationCity(value);
    setDestinationCity(value);
    setDestinationCityFilled(value !== '');
  };

  const handleLogoClick = () => {
    setShowPrices(false); // Cambia el estado para ocultar VerPrecios cuando se hace clic en el logo
    setShowMainButtons(true);
    setShowModifySearch(false);
    setShowPassengerSelection(false);
    setPassengerSelectionConfirmed(false);
    setShowModifyForm(false);
  };

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=optional"
      />
      {/* Nuevo contenedor para el encabezado */}
      <div className="header-container">
        <div className="top-panel">
          <div className="logo-container" onClick={handleLogoClick}>
            <Image src={logo.src} alt="Logode Aerolínea" className="logo" width={50} height={50}/>
            <span className="logo-title">Singapur Airlines</span>
          </div>
          <div className="buttons-container">
            {showMainButtons ? (
              <>
                <button style={{ fontWeight: 'bold' }} className="header-button">
                  Reserva tu vuelo
                </button>
                <button style={{ fontWeight: 'bold' }} className="header-button">
                  Ofertas y destinos
                </button>
                <button style={{ fontWeight: 'bold' }} className="header-button">
                  Tu reserva
                </button>
                <button style={{ fontWeight: 'bold' }} className="header-button">
                  Información y ayuda
                </button>
              </>
            ) : (
              <>
                <button
                  style={{ fontWeight: 'bold' }}
                  className={`header-button ${tripType === 'roundTrip' ? 'selected' : ''}`}
                >
                  <span className="material-symbols-outlined header-button-icon-numbers">
                    looks_one
                  </span>
                  Selección de Vuelos
                </button>

                <button
                  style={{ fontWeight: 'bold' }}
                  className={`header-button ${tripType === 'oneWay' ? 'selected' : ''}`}
                >
                  <span className="material-symbols-outlined header-button-icon-numbers">
                    looks_two
                  </span>
                  Personaliza tu viaje
                </button>

                <button
                  style={{ fontWeight: 'bold' }}
                  className={`header-button ${tripType === 'payments' ? 'selected' : ''}`}
                >
                  <span className="material-symbols-outlined header-button-icon-numbers">
                    looks_3
                  </span>
                  Pagos
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {!showModifyForm && (

      <>

      <div className="container">
        <label>
          <input
            type="radio"
            name="tripType"
            value="roundTrip"
            checked={tripType === 'roundTrip'}
            onChange={() => setTripType('roundTrip')}
          />
          Ida y vuelta
        </label>
        <label>
          <input
            type="radio"
            name="tripType"
            value="oneWay"
            checked={tripType === 'oneWay'}
            onChange={() => setTripType('oneWay')}
          />
          Solo ida
        </label>
        <form
          className="form-container"
          id="flightForm"
          onSubmit={handleSearch}
        >
          <div className="input-container">
            <label htmlFor="origin">Desde</label>
            <div className="input-icon-container">
              <span className="icono">
                <span className="material-symbols-outlined">flight_takeoff</span>
              </span>
              <input
                type="text"
                id="origin"
                name="origin"
                value={originCity}
                onChange={handleOriginChange}
                autoComplete="off"
                list="cityList"
              />
            </div>
            
            <datalist id="cityList">
              {filteredCities.map((city) => (
                <option key={city.id} value={city.city} />
              ))}
            </datalist>
          </div>

          <div className="input-container">
            <label htmlFor="destination">Hasta</label>
            <div className="input-icon-container">
              <span className="icono">
                <span className="material-symbols-outlined">flight_land</span>
              </span>
              <input
                type="text"
                id="destination"
                name="destination"
                value={destinationCity}
                onChange={handleDestinationChange}
                autoComplete="off" // Desactiva el autocompletar del navegador
                list="cityListDestination" // Asocia un datalist para mostrar sugerencias
              />
            </div>
            <datalist id="cityListDestination">
              {filteredCities.map((city) => (
                <option key={city.id} value={city.city} />
              ))}
            </datalist>
          </div>

          <div className="dates-container">
            <label htmlFor="departureDate">Ida:</label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>

          {tripType === 'roundTrip' && (
            <div className="dates-container">
              <label htmlFor="returnDate">Vuelta:</label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          )}

          <div className="passengers-container">
            <label htmlFor="passengers" onClick={togglePassengerSelection}>
              Pasajeros
            </label>
            <div className="input-icon-container">
              <span className="icono" onClick={togglePassengerSelection}>
                <span className="material-symbols-outlined">group</span>
              </span>
              <div className="passenger-value">
                {adults + child + infants} {/* Mostrar el total de pasajeros */}
              </div>
            </div>
            {showPassengerSelection && (
              <div className="passenger-selection">
                <label className="title-flight">¿Quienes Vuelan?</label>
                <div className="passenger-type">
                  <label className = "title-sits">Adultos</label>
                  <div className="passenger-counter">
                    <button type="button" onClick={() => handleAdultChange(Math.max(adults - 1, 0))}>-</button>
                    <span>{adults}</span>
                    <button type="button" onClick={() => handleAdultChange(adults + 1)}>+</button>
                  </div>
                </div>
                <label className="sit-description">Desde 12 años</label>
                <div className="passenger-type">
                  <label className = "title-sits">Niños</label>
                  <div className="passenger-counter">
                    <button type="button" onClick={() => handleChildrenChange(Math.max(child - 1, 0))}>-</button>
                    <span>{child}</span>
                    <button type="button" onClick={() => handleChildrenChange(child + 1)}>+</button>
                  </div>
                </div>
                <label className="sit-description">De 2 a 11 años</label>
                <div className="passenger-type">
                  <label className = "title-sits">Bebés</label>
                  <div className="passenger-counter" >
                    <button type="button" onClick={() => handleInfantsChange(Math.max(infants - 1, 0))}>-</button>
                    <span>{infants}</span>
                    <button type="button" onClick={() => handleInfantsChange(infants + 1)}>+</button>
                  </div>
                </div>
                <label className="sit-description">Menores de 2 años</label>
                <button className="confirm-button" onClick={handleConfirm}>Confirmar</button>
              </div>
            )}            
          </div>

          <button type="submit" style={{ display: showMainButtons ? 'inline-block' : 'none' }}>
            Buscar
          </button>
          {/*  botón "Modificar Búsqueda" */}
          <button
            type="button"
            className="modify-search-button"
            style={{ display: showModifySearch ? 'inline-block' : 'none' }}
            onClick={handleLogoClick}
          >
            Modificar
      </button>
        </form>
      </div>
      </>

)} 

{showModifyForm && (

<>

<div className="container">
  <label>
    <input
      type="radio"
      name="tripType"
      value="roundTrip"
      checked={tripType === 'roundTrip'}
      onChange={() => setTripType('roundTrip')}
    />
    Ida y vuelta
  </label>
  <label>
    <input
      type="radio"
      name="tripType"
      value="oneWay"
      checked={tripType === 'oneWay'}
      onChange={() => setTripType('oneWay')}
    />
    Solo ida
  </label>
  <form
    className="form-container"
    id="flightForm"
    onSubmit={handleSearch}
  >
    <div className="input-container">
      <label htmlFor="origin">Desde</label>
      <div className="input-icon-container">
        <span className="icono">
          <span className="material-symbols-outlined">flight_takeoff</span>
        </span>
        <input
          type="text"
          id="origin"
          name="origin"
          value={originCity}
          readOnly
        />
      </div>
    </div>

    <div className="input-container">
      <label htmlFor="destination">Hasta</label>
      <div className="input-icon-container">
        <span className="icono">
          <span className="material-symbols-outlined">flight_land</span>
        </span>
        <input
          type="text"
          id="destination"
          name="destination"
          value={destinationCity}
          readOnly
        />
      </div>
    </div>

    <div className="dates-container">
      <label htmlFor="departureDate">Ida:</label>
      <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={departureDate}
              readOnly
            />
    </div>

      <div className="dates-container">
        <label>Vuelta:</label>
        <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={returnDate}
              readOnly
            />
      </div>
    
    <div className="passengers-container">
      <label htmlFor="passengers">
        Pasajeros
      </label>
      <div className="input-icon-container">
        <span className="icono">
          <span className="material-symbols-outlined">group</span>
        </span>
        <div className="passenger-value">
          {adults + child + infants} {/* Mostrar el total de pasajeros */}
        </div>
      </div>       
    </div>

    <button type="submit" style={{ display: showMainButtons ? 'inline-block' : 'none' }}>
      Buscar
    </button>
    {/*  botón "Modificar Búsqueda" */}
    <button
      type="button"
      className="modify-search-button"
      style={{ display: showModifySearch ? 'inline-block' : 'none' }}
      onClick={handleLogoClick}
    >
      Modificar
</button>
  </form>
</div>
</>

)} 
    
      {/* Espacio adicional para separar los componentes */}
      <div style={{ height: '50px' }} />

      <div className="ver-vuelos">
        
  {/* Historial de búsqueda */}
  <div className="search-history">
    <ul className="search-history-list">
      {searchHistory.map((entry, index) => (
        <li key={index}>
          {entry}
          <button
            className="remove-button" onClick={() => handleRemoveEntry(index)}>X</button>
        </li>
      ))}
    </ul>
  </div>
</div>

      {/* Renderiza el nuevo componente FlightHeader solo cuando showPrices es true */}

      {/* Renderiza VerPrecios solo cuando showPrices es true */}
      {showPrices && <VerPrecios originCity={originCity} destinationCity={destinationCity} adults={adults} child={child} infants={infants} />}

      {/* Renderiza la promoción solo cuando showPrices es false */}
      {!showPrices && (
        <div className="promo">
          <Image src={beach.src} alt="Playa" className="promo-image" width={1000} height={1000} />
        </div>
      )}
    </div>
  );
}
