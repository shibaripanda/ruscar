import { Accordion, Group } from "@mantine/core";
import { Car } from "../../interfaces/car";

interface CarAcordControl {
    car: Car;
}

export function AcordControl({car} : CarAcordControl) {

   return (
    <Accordion.Control>
        <Group justify="space-between">
            <div>{car.order}</div>
            <div>{new Date(car.createdAt).toLocaleDateString()}</div>
            <div>{car.marka} {car.model}</div>  
            <div>{car.age}</div>
            <div>{car.status}</div>
            <div>{car.deleted ? 'Удалено' : 'Активно'}</div>
        </Group>
    </Accordion.Control>
   )

  
}