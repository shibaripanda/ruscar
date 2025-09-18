import { Accordion, Button, Collapse, Divider, Grid, Group, Image, Space, Text, Textarea, TextInput } from "@mantine/core";
import { Car } from "../../interfaces/car";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

function formatCreatedAt(createdAt: number) {
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

interface CarAcordPanel {
    car: Car;
    addHistory: any;
    deleteCar: any;
    statusCar: any;
}

export function AcordPanel({car, addHistory, deleteCar, statusCar} : CarAcordPanel) {

  const statuses = ['open' , 'closeUnhappy' , 'closeHappy']
  const lineHistory = 3

  const [historyText, setHistoryTexy] = useState('')
  const [deleteText, setDeleteText] = useState('')
  const [opened, { toggle }] = useDisclosure(false);

   return (
    <Accordion.Panel>
        <Space h='sm'/>
        {car.vin}
        <Space h='sm'/>
        {car.info}
        <Space h='sm'/>
        {car.contact ? car.contact : ''}
        <Divider my="md" />
        <Group justify="space-between">
          <Group>
            
          </Group>
          <Group>
            {statuses.map(st => 
            <Button key={st} variant='default' onClick={() => statusCar(car._id, st)} disabled={car.status === st}>
              {st}
            </Button>)
            }
          </Group>
        </Group>
        <Divider my="md" />
        <Textarea onChange={(v) => setHistoryTexy(v.target.value)} value={historyText}/>
        <Space h='sm'/>
        <Group justify="space-between">
          <Group>
            <Button 
            disabled={historyText === ''} 
            onClick={() => {
                addHistory(car._id, historyText)
                setHistoryTexy('')
              }
            }>Добавить в историю
            </Button>
          </Group>
          <Group>
          </Group>
        </Group>
        
        <Divider my="md" />
        {car.dataHistoryLine.length ? <>
        <Group justify="space-between">
          <Text fw={700}>История</Text>
          {car.dataHistoryLine.length > lineHistory ? <Button size="xs" variant="default" onClick={toggle}>{opened ? 'Свернуть историю' : 'Развернуть историю'}</Button> : ''}
          {car.dataHistoryLine.length > lineHistory ? <Text fw={700}>{opened ? car.dataHistoryLine.length + ' / ' + car.dataHistoryLine.length : lineHistory + ' / ' + car.dataHistoryLine.length}</Text> : ''}
        </Group>
        <Space h='sm'/>

        {car.dataHistoryLine.length ? 
          car.dataHistoryLine.sort((a, b) => b.date - a.date).slice(0, lineHistory).map(h =>
          <div key={h.date}>
              <Group>
                  <Text c='green' fs="italic" fw={700}>{formatCreatedAt(h.date)} / {h.tId}</Text> {h.text}
              </Group>
              
              <Divider my="md" />
          </div> 
          )
        : 'История отсутствует'}

        <Collapse in={opened}>
        {car.dataHistoryLine.length ? 
            car.dataHistoryLine.sort((a, b) => b.date - a.date).slice(lineHistory, car.dataHistoryLine.length).map(h =>
            <div key={h.date}>
                <Group >
                    <Text c='green' fs="italic" fw={700}>{formatCreatedAt(h.date)} / {h.tId}</Text> {h.text}
                </Group>
                
                <Divider my="md" />
            </div> 
            )
        : 'История отсутствует'}
        </Collapse></> : ''}

        <Space h='lg'/>
        {car.media.length ? <Grid>
          {car.media.map((item, index)=> 
            <Grid.Col span={3} key={index}>
              <Image 
                src={`data:image/jpeg;base64,${item}`}
                radius="sm"
                h='auto'
                w="15vmax"
              />
            </Grid.Col>
          )}
        </Grid> : 'Загрузка фото...'}
        <Group justify="flex-end">
          <TextInput value={deleteText} onChange={(v) => setDeleteText(v.target.value)}/>
          <Button
            color='red' 
            disabled={deleteText !== car.order} 
            onClick={() => {
                deleteCar(car._id)
                setDeleteText('')
              }
            }>Удалить
          </Button>
        </Group>
    </Accordion.Panel>
   )

  
}