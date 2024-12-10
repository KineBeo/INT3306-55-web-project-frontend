export interface Airplane {
    id: number;
    model_name: string;
    manufacturer: string;
    serial_number: string;
    registration_number: string;
    capacity: number;
    economy_seats: number;
    business_seats: number;
    first_class_seats: number;
    status: "ACTIVE" | "INACTIVE";
};