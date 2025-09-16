import { useEffect, useState } from 'react';
import { Accordion, Container, Title } from '@mantine/core';
import classes from './MainPage.module.css';
import { AcordControl } from '../components/AcordControl';
import { AcordPanel } from '../components/AcordPanel';
import { Car } from '../../interfaces/car';

export function MainPage({ socket, isSocketConnected}: any) {
  const [cars, setCars] = useState<Car[]>([])
  const [valueCar, setValueCar] = useState<string | null>(null);

   useEffect(() => {
    if (isSocketConnected) {
      getGarage()
    }
  }, [isSocketConnected])

  useEffect(() => {
    if (valueCar && !cars.find(c => c._id === valueCar)?.media.length)
    getMedia(valueCar)
  }, [valueCar])

  const addHistory = async (_id: string, text: string) => {
    console.log(_id, text)
      socket.emit('addHistory', {_id: _id, text: text}, (response: { tId: number; text: string; date: number }[]) => {
          console.log('response', response)
          setCars(ex => {
            const index = ex.findIndex( c => c._id === _id)
            if (index > -1) {
              ex[index].dataHistoryLine = response
            }
            return [...ex]
          });
        });
      };

  const getGarage = async () => {
    socket.emit('getGarage', {}, (response: Car[]) => {
      console.log('response', response)
      setCars(response.map(car => ({...car, media: []})));
      // setCars(response.map(car => ({...car, media: []})).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    });
  };

  const getMedia = async (_id: string) => {
    socket.emit('getMedia', {_id}, (response: any[]) => {
      console.log('response', response)
      setCars(ex => {
        const index = ex.findIndex( c => c._id === _id)
        if (index > -1) {
          ex[index].media = response
        }
        return [...ex]
      });
    });
  }

  return (
    <Container size="lg" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        RUSCAR24
      </Title>

      <Accordion variant="separated" value={valueCar} onChange={setValueCar}>

        {cars.map(car => 
          <Accordion.Item className={classes.item} value={car._id} key={car._id}>
            <AcordControl car={car}/>
            <AcordPanel car={car} addHistory={addHistory}/>
          </Accordion.Item>
        )}

      </Accordion>
    </Container>
  );
}
