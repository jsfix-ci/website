import React, { useState } from 'react';
import s from './style.module.less';
import cN from 'classnames';

import { CampaignMap } from '../../CampaignMap';
import { SearchPlaces } from '../../Forms/SearchPlaces';
import { SectionInner } from '../../Layout/Sections';
import { CampainVisualisation } from '../../CampaignVisualisations';
import SignUp from '../../Forms/SignUp';
import { getStringFromPlaceholderText } from '../../utils';

// const MunicipalityHeadline = ({ className, municipality, type }) => {
//   const action =
//     type === 'qualifying'
//       ? 'Bring das Grundeinkommen '
//       : 'Teste Grundeinkommen ';
//   const localPreposition =
//     type === 'qualifying' && !!municipality ? 'nach ' : 'in ';
//   const generic = type === 'qualifying' ? 'deine Gemeinde' : 'deiner Gemeinde';
//   const place = !!municipality ? `${municipality.name}` : generic;
//   return (
//     <h1 className={cN(s.headline, className)}>
//       {action}
//       {localPreposition}
//       {place}!
//     </h1>
//   );
// };

const ColumnQualifying = ({
  municipality,
  type,
  handlePlaceSelect,
  displayTitle,
}) => {
  return (
    <>
      <SearchPlaces
        placeholder={!!municipality ? municipality.name : 'Gemeinde'}
        label={false}
        onPlaceSelect={handlePlaceSelect}
        showButton={true}
        inputSize="SMALL"
        buttonSize="MEDIUM"
      />
      <h1 className={s.headline}>{displayTitle}</h1>

      {!!municipality && (
        <CampainVisualisation
          goal={5000}
          currentCount={1000}
          receivedCount={2000}
          count={3000}
          // showCTA={visualisations.length !== 1 && visualisation.ctaLink}
          labels={{
            NEEDED: () => <>Benötigte Anmeldungen</>,
            GOAL_INBETWEEN_TOOLTIP: count => (
              <>
                Insgesamt benötigt:
                <br />
                {count} Anmeldungen
              </>
            ),
            GOAL_INBETWEEN: count => <>Nächstes Ziel: {count} Anmeldungen</>,
            CURRENT_COUNT: () => <>Anmeldungen</>,
            CTA: () => <>Mitmachen</>,
          }}
          currency="Anmeldungen"
          startDate={new Date()}
        />
      )}
    </>
  );
};

const BodyQualifying = ({ municipality, displayBody }) => {
  return (
    <div>
      <p>{displayBody}</p>
      <div className={s.adjustFinallyMessage}>
        <SignUp
          AuthenticatedDialog="municipality"
          // fields={['username', 'email']}
          forMunicipality={municipality ? municipality : true}
        />
      </div>
    </div>
  );
};

const ColumnCollecting = ({
  municipality,
  type,
  handlePlaceSelect,
  displayTitle,
}) => {
  return (
    <>
      <h1 className={s.headline}>{displayTitle}</h1>
      <SearchPlaces
        placeholder={!!municipality ? municipality.name : 'Gemeinde'}
        label={false}
        onPlaceSelect={handlePlaceSelect}
        showButton={true}
        inputSize="SMALL"
        buttonSize="MEDIUM"
      />
    </>
  );
};

const ColumnState = ({
  municipality,
  type,
  handlePlaceSelect,
  displayTitle,
}) => {
  return (
    <>
      <h1 className={s.headline}>{displayTitle}</h1>
      <SearchPlaces
        placeholder={!!municipality ? municipality.name : 'Gemeinde'}
        label={false}
        onPlaceSelect={handlePlaceSelect}
        showButton={true}
        inputSize="SMALL"
        buttonSize="MEDIUM"
      />
    </>
  );
};

const MapColumn = ({ municipality }) => {
  return (
    <div className={s.headerContainer}>
      <CampaignMap
        className={s.mapContainer}
        AgsToFlyTo={!!municipality ? municipality.ags : undefined}
        animateOnLoad={true}
        flyToAgsOnLoad={false}
      />
    </div>
  );
};

const states = [
  { ags: '11000000', slug: 'berlin', name: 'Berlin' },
  { ags: '04011000', slug: 'bremen', name: 'Bremen' },
  { ags: '02000000', slug: 'hamburg', name: 'Hamburg' },
];

export const MunicipalityIntro = ({ pageContext, className, title, body }) => {
  const { slug } = pageContext;
  let { municipality } = pageContext;
  let type = municipality?.type;

  if (slug === 'gemeinden') {
    type = 'qualifying';
  } else if (slug === 'gemeinden-sammelphase') {
    type = 'collecting';
  } else {
    const state = states.find(s => s.slug === slug);
    type = 'state';
    municipality = state;
  }

  let displayTitle = getStringFromPlaceholderText(title, municipality);
  let displayBody = getStringFromPlaceholderText(body, municipality);

  const [, setAgs] = useState();
  const handlePlaceSelect = municipality => {
    if (municipality) {
      setAgs(municipality.ags);
    } else {
      setAgs();
    }
  };
  const columnProps = { municipality, type, handlePlaceSelect, displayTitle };
  return (
    <div className={cN(className, s.mapSection)}>
      <div className={s.twoColumnContainer}>
        <div className={s.twoColumnItem}>
          <MapColumn municipality={municipality} />
        </div>
        <div className={s.twoColumnItem}>
          <div className={s.rightColumnContainer}>
            <SectionInner>
              {type === 'qualifying' && <ColumnQualifying {...columnProps} />}
              {type === 'collecting' && <ColumnCollecting {...columnProps} />}
              {type === 'state' && <ColumnState {...columnProps} />}
            </SectionInner>
          </div>
        </div>
      </div>
      <div className={s.sectionBody}>
        <SectionInner>
          <BodyQualifying
            municipality={municipality}
            displayBody={displayBody}
          />
        </SectionInner>
      </div>
    </div>
  );
};
