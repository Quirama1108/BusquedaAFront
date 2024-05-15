interface VerPreciosProps {
    originCity: string;
    destinationCity: string;
    adults: number;
    child: number;
    infants: number;
    applyFilter?: (filter: string) => void;
}