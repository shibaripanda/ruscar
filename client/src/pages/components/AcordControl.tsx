import { Accordion, Group, Text } from "@mantine/core";
import { Car } from "../../interfaces/car";

interface CarAcordControl {
    car: Car;
}

export function AcordControl({car} : CarAcordControl) {

   return (
    <Accordion.Control>
        <Group justify="space-between">
            <div><Text fw={700}>{car.order}</Text></div>
            <div>{new Date(car.createdAt).toLocaleDateString()}</div>
            <div>{car.marka} {car.model}</div>  
            <div>{car.age}</div>
            <div>{car.status}</div>
            <div>{car.deleted ? <Text c={'red'}>Удалено</Text> : <Text c={'green'}>Активно</Text>}</div>
        </Group>
    </Accordion.Control>
   )

  
}