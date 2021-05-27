import React, { useContext } from 'react';

import { MunicipalityContext } from '../../context/Municipality';

import { SignupButtonAndTile } from './SignupButtonAndTile';
import { InlineLinkButton } from '../Forms/Button';
import * as s from './style.module.less';
import loadable from '@loadable/component';

const Ticker = loadable(() => import('./Ticker'));
const TickerMunicipality = loadable(() =>
  import('./Ticker/TickerMunicipality')
);

export const TickerToSignup = ({
  tickerDescription: tickerDescriptionObject,
}) => {
  const { municipality } = useContext(MunicipalityContext);
  const tickerDescription = tickerDescriptionObject?.tickerDescription;

  return (
    <>
      {municipality?.ags ? (
        <TickerMunicipality
          tickerDescription={tickerDescription}
          fallback={<div>Lade...</div>}
        />
      ) : (
        <Ticker
          tickerDescription={tickerDescription}
          fallback={<div>Lade...</div>}
        />
      )}

      <SignupButtonAndTile className={s.centerButton} />
      <div className={s.moreInfo}>
        <InlineLinkButton href="#info">Mehr erfahren</InlineLinkButton>
      </div>
    </>
  );
};

// Default export needed for lazy loading
export default TickerToSignup;
