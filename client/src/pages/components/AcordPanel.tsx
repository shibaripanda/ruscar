import { Accordion, Button, Grid, Group, Image, Space, Text, Textarea } from "@mantine/core";
import { Car } from "../../interfaces/car";
import { useState } from "react";

interface CarAcordPanel {
    car: Car;
    addHistory: any;
}

export function AcordPanel({car, addHistory} : CarAcordPanel) {

  const [historyText, setHistoryTexy] = useState('')

   return (
    <Accordion.Panel>
        {car.vin}
        <Space h='sm'/>
        {car.info}
        <Space h='sm'/>
        <Textarea onChange={(v) => setHistoryTexy(v.target.value)} value={historyText}/>
        <Space h='sm'/>
        <Button disabled={historyText === ''} onClick={() => {
            addHistory(car._id, historyText)
            setHistoryTexy('')
          }
        }>Сохранить</Button>
        <Space h='sm'/>
        {car.dataHistoryLine.length ? 
            car.dataHistoryLine.sort((a, b) => b.date - a.date).map(h =>
            <div key={h.date}>
                <Group >
                    <Text td="underline" fw={700}>{new Date(h.date).toLocaleDateString()} : {h.tId}</Text> 
                </Group>
                {h.text}
                <Space h='sm'/>
            </div> 
            )
        : 'История отсутствует'}
        <Space h='lg'/>
        {car.media.length ? <Grid>
          {car.media.map((item, index)=> 
            <Grid.Col span={3} key={index}>
              <Image 
                src={`data:image/jpeg;base64,${item}`}
                radius="sm"
                h='20vmax'
                w="auto"
              />
            </Grid.Col>
          )}
        </Grid> : 'Загрузка фото...'}
    </Accordion.Panel>
   )

  
}