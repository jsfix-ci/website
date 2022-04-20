/**
 * These hooks make use of the app backend (of the DWE enteignen app) or our own backend to fetch collection meetups
 */

import { useState } from 'react';
import CONFIG from '../../../../../backend-config';

// The whole naming of meetups does not really make that much sense anymore, since
// we are using the new api backend structure, where list locations and events are two
// entirely different api and schemas.
// I am leaving it like this anyway, just beware that meetups are events OR list locations

export const useGetMeetups = () => {
  const [meetups, setMeetups] = useState();

  return [meetups, state => getMeetups(state, setMeetups)];
};

// gets meetups: berlin meetups are fetched from app backend
// everything else are fetched from our backend
const getMeetups = async (state, setMeetups) => {
  try {
    const isBerlin = state === 'berlin';

    if (isBerlin) {
      // In comparison to the way we handle events and list locations in our backend
      // those two types are two different api endpoints in the app backend
      const [eventsResponse, listLocationsResponse] = await Promise.all([
        getEventsFromAppApi(),
        getListLocationsFromAppApi(),
      ]);

      if (
        eventsResponse.status === 200 &&
        listLocationsResponse.status === 200
      ) {
        // We don't need to thoroughly format list locations, only event meetups
        const events = formatMeetups(true, false, await eventsResponse.json());
        const listLocations = formatMeetups(
          true,
          true,
          await listLocationsResponse.json()
        );

        setMeetups([...events, ...listLocations]);
      } else {
        console.log(
          'Response is not 200',
          eventsResponse.status,
          listLocationsResponse.status
        );
      }
    } else {
      const response = await getMeetupsFromWebsiteApi();

      if (response.status === 200) {
        const json = await response.json();

        // Filter meetups so they are only from democracy campaign
        const filteredMeetups = json.data.filter(
          ({ campaign }) => campaign?.state === state
        );

        // IsListLocation does not matter for non berlin meetups
        setMeetups(formatMeetups(false, false, filteredMeetups));
      } else {
        console.log('Response is not 200', response.status);
      }
    }
  } catch (error) {
    console.log('Error while getting meetups', error);
  }
};

const getEventsFromAppApi = () => {
  // Endpoint is POST to optionally receive  a filter as body
  const request = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    // Pass filter with attribute details to also fetch description
    body: JSON.stringify({ details: true }),
  };

  return fetch(`${CONFIG.APP_API.INVOKE_URL}/service/termine`, request);
};

const getListLocationsFromAppApi = () => {
  const request = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(
    `${CONFIG.APP_API.INVOKE_URL}/service/listlocations/actives`,
    request
  );
};

const getMeetupsFromWebsiteApi = () => {
  const request = {
    method: 'GET',
    mode: 'cors',
  };

  return fetch(`${CONFIG.API.INVOKE_URL}/meetups`, request);
};

const formatMeetups = (isBerlin, isListLocation, meetups) => {
  // We want to bring the meetups from the backend into the same format as
  // the ones from contentful
  if (isBerlin) {
    if (!isListLocation) {
      // Using reduce to filter and map ad same time
      return meetups.reduce(
        (
          filteredArray,
          { beginn, ende, latitude, longitude, ort, details, typ }
        ) => {
          // Filter out events of the past
          if (new Date(beginn) > new Date()) {
            filteredArray.push({
              location: {
                lon: longitude,
                lat: latitude,
              },
              description: details?.beschreibung,
              contact: details?.kontakt,
              title: typ === 'Sammeln' ? 'Sammelaktion' : typ,
              startTime: beginn,
              endTime: ende,
              locationName: ort,
              address: details?.treffpunkt,
              // TODO: maybe diversify in the future to account for other events
              type: 'collect',
            });
          }
          return filteredArray;
        },
        []
      );
    } else {
      // List locations
      return meetups.map(location => ({
        ...location,
        location: { lon: location.longitude, lat: location.latitude },
        locationName: location.name,
        type: 'lists',
        address:
          location.street && location.number
            ? `${location.street} ${location.number}`
            : null,
        title: 'Listen ausgelegt',
      }));
    }
  } else {
    return meetups.map(
      ({ coordinates, description, type, locationName, ...rest }) => ({
        location: {
          lon: coordinates[0],
          lat: coordinates[1],
        },
        description: description,
        title:
          type === 'collect'
            ? 'Sammelaktion'
            : `Unterschreiben: ${locationName}`,
        type,
        ...rest,
      })
    );
  }
};
