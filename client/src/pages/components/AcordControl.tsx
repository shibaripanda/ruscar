import { Accordion, Group, Text } from "@mantine/core";
import { Car } from "../../interfaces/car";

function formatCreatedAt(createdAt: Date) {
  const date = new Date(createdAt);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    // возвращаем часы и минуты, с ведущим нулем
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  } else {
    // возвращаем дату в формате дд.мм.гггг
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }
}

interface CarAcordControl {
    car: Car;
}

export function AcordControl({car} : CarAcordControl) {

   return (
    <Accordion.Control>
        <Group justify="space-between">
            <div><Text fw={700}>{car.order}</Text></div>
            <div>{formatCreatedAt(car.createdAt)}</div>
            <div>{car.marka} {car.model}</div>  
            <div>{car.age}</div>
            <div>{car.status}</div>
            <div>{car.deleted ? <Text c={'red'}>Удалено</Text> : <Text c={'green'}>Активно</Text>}</div>
        </Group>
    </Accordion.Control>
   )

  
}