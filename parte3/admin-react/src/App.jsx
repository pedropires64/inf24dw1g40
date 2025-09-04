import React from 'react'
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, Create, SimpleForm, TextInput, NumberInput, DateTimeInput } from 'react-admin'
import dataProvider from './dataProvider'

const VenueCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="city" />
      <NumberInput source="capacity" />
    </SimpleForm>
  </Create>
)

const EventCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="id_venue" />
      <TextInput source="name" />
      <DateTimeInput source="date" />
      <TextInput source="status" />
      <TextInput source="description" />
    </SimpleForm>
  </Create>
)

const TicketCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="id_event" />
      <TextInput source="type" />
      <NumberInput source="price" />
      <TextInput source="status" />
    </SimpleForm>
  </Create>
)

const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="email" />
    </SimpleForm>
  </Create>
)

export default function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="users" list={ListGuesser} show={ShowGuesser} edit={EditGuesser} create={UserCreate} options={{ label: 'Users' }} />
      <Resource name="venues" list={ListGuesser} show={ShowGuesser} edit={EditGuesser} create={VenueCreate} options={{ label: 'Venues' }} />
      <Resource name="events" list={ListGuesser} show={ShowGuesser} edit={EditGuesser} create={EventCreate} options={{ label: 'Events' }} />
      <Resource name="tickets" list={ListGuesser} show={ShowGuesser} edit={EditGuesser} create={TicketCreate} options={{ label: 'Tickets' }} />
    </Admin>
  )
}