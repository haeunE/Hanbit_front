import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Plus () {
  const { t } = useTranslation();
  const [isTextVisible, setIsTextVisible] = useState(false);
  const toggleText = () => {setIsTextVisible(!isTextVisible);};
  return (
    <div>
      <button className='tt' onClick={toggleText}>{t`plus.title`}</button>
      {isTextVisible && <p>
        <b>{t`plus.passfort`}:</b> {t`plus.passfort-text`}<br />
        <b>{t`plus.visa`}:</b>{t`plus.visa-text`}<br />
        <b>{t`plus.picture`}:</b> {t`plus.picture-text`}<br />
        <b>{t`plus.reserve`}:</b> {t`plus.reserve-text`}<br />
        <b>{t`plus.motel`}:</b> {t`plus.motel-text`}<br />
        <b>{t`plus.finance`}:</b> {t`plus.finance-text`}<br />
        <b>{t`plus.document`}:</b>{t`plus.document-text`}<br /><br />
        </p>}
    </div>
  );
}

export default Plus;