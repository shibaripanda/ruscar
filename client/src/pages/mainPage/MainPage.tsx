import { useEffect, useMemo, useState } from 'react';
import { Accordion, ActionIcon, Container, Group, Text, TextInput, Title } from '@mantine/core';
import classes from './MainPage.module.css';
import { AcordControl } from '../components/AcordControl';
import { AcordPanel } from '../components/AcordPanel';
import { Car } from '../../interfaces/car';
import { IconX } from '@tabler/icons-react';

export function MainPage({ socket, isSocketConnected}: any) {
  const [cars, setCars] = useState<Car[]>([])
  const [valueCar, setValueCar] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('')

   useEffect(() => {
    if (isSocketConnected) {
      getGarage()
    }
  }, [isSocketConnected])

  useEffect(() => {
    if (valueCar && !cars.find(c => c._id === valueCar)?.media.length)
    getMedia(valueCar)
  }, [valueCar])

  const filterCars = useMemo(() => {
    if(search) {
      return cars.filter(car => `${car.order} ${car.marka} ${car.model} ${car.info}`.toLowerCase().includes(search.toLowerCase()))
    }
    return cars
  }, [cars, search])

  const addHistory = async (_id: string, text: string) => {
    socket.emit('addHistory', {_id: _id, text: text}, (response: { tId: number; text: string; date: number }[]) => {
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
      setCars(
        response.map(car => ({...car, media: [], updatedAt: new Date(car.updatedAt), createdAt: new Date(car.createdAt)}))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      );
    });
  };

  const getMedia = async (_id: string) => {
    socket.emit('getMedia', {_id}, (response: any[]) => {
      setCars(ex => {
        const index = ex.findIndex( c => c._id === _id)
        if (index > -1) {
          ex[index].media = response
        }
        return [...ex]
      });
    });
  }

  const deleteCar = async (_id: string) => {
    socket.emit('deleteCar', {_id}, (response: boolean) => {
      if (response) setCars(cars.filter(c => c._id !== _id));
    });
  }

  const statusCar = async (_id: string, status: string) => {
    socket.emit('statusCar', {_id: _id, status: status}, (response: {status: "open" | "closeUnhappy" | "closeHappy"; dataHistoryLine: { tId: number; text: string; date: number }[]}) => {
      if(!response) return
      setCars(ex => {
        const index = ex.findIndex( c => c._id === _id)
        if (index > -1) {
          ex[index].status = response.status
          ex[index].dataHistoryLine = response.dataHistoryLine
        }
        return [...ex]
      });
    });
  }

  return (
    <Container size="lg" className={classes.wrapper}>
      <Group justify="space-between">
      <TextInput ta="center" className={classes.title} placeholder='Поиск' value={search} onChange={(v) => setSearch(v.target.value)}
        rightSection={
        search && (
          <ActionIcon
            variant="subtle"
            onClick={() => setSearch("")}
          >
            <IconX size={14} />
          </ActionIcon>
        )
      }></TextInput>
      <Text ta="center" className={classes.title}>
        {filterCars.length} / {cars.length}
      </Text>
      <Title ta="center" className={classes.title}>
        RUSCAR24
      </Title>
      </Group>

      <Accordion chevron variant="separated" value={valueCar} onChange={setValueCar}>

        {filterCars.map(car => 
          <Accordion.Item className={classes.item} value={car._id} key={car._id}>
            <AcordControl car={car}/>
            <AcordPanel car={car} addHistory={addHistory} deleteCar={deleteCar} statusCar={statusCar}/>
          </Accordion.Item>
        )}

      </Accordion>
    </Container>
  );
}
