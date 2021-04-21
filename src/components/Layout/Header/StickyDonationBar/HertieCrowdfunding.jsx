import React, { useContext } from 'react';
import s from './hertieStyle.module.less';
import { StickyBannerContext } from '../../../../context/StickyBanner';
import { CrowdfundingVisual } from '../../../CrowdfundingInfo/CrowdfundingVisual';
import cN from 'classnames';

export const HertieCrowdfunding = () => {
  const closeIcon = require('./close-icon.svg');
  const arrowDown = require('./arrow-down.svg');
  const { closeStickyBanner } = useContext(StickyBannerContext);

  return (
    <div className={s.donationBar}>
      <div className={s.donationBarItemContainer}>
        <img
          aria-hidden="true"
          alt=""
          className={s.closeButton}
          src={closeIcon}
          onClick={() =>
            closeStickyBanner({ whichBanner: 'hertieCrowdfunding' })
          }
        />
        <div className={s.leftSection}>
          <p className={s.crowdfundingHeading}>
            <b>Mach mit beim Crowdfunding!</b>
          </p>
          <p className={s.crowdfundingDescription}>
            Bring mit deiner Spende Grundeinkommen näher an die Realität. Egal
            ob 1€ oder 100€ – jede Spende zählt!
          </p>
          <div className={s.visualisationForMobile}>
            <CrowdfundingVisual />
          </div>
          <div className={s.actionRow}>
            <button
              className={s.crowdfundingCTA}
              onClick={() =>
                window.open('https://www.startnext.com/DvZ', '_blank')
              }
            >
              Zum Crowdfunding
            </button>
            <div
              className={s.engageText}
              aria-hidden="true"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '#crowdfunding';
                link.click();
                closeStickyBanner({ whichBanner: 'hertieCrowdfunding' });
              }}
            >
              <span className={s.moreInfo}>Mehr erfahren</span>
              <img alt="" className={s.arrowDown} src={arrowDown} />
            </div>
          </div>
        </div>
        <div className={cN(s.rightSection, s.visualisationForDesktop)}>
          <CrowdfundingVisual />
        </div>
      </div>
    </div>
  );
};
