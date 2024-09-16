import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Captcha = ({ onChange }) => {
  const siteKey = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY;
  const isCaptchaEnabled = import.meta.env.VITE_APP_ENABLE_CAPTCHA === 'true';

  if (!isCaptchaEnabled) {
    return null; // Do not render anything if captcha is disabled
  }

  if (!siteKey) {
    console.error("Missing VITE_APP_RECAPTCHA_SITE_KEY environment variable");
    return null;
  }

  return (
    <div className="mt-4">
      <div className="inline-block">
        <ReCAPTCHA
          sitekey={siteKey}
          onChange={onChange}
          theme="light"  // Use 'dark' if your app has a dark theme
        />
      </div>
    </div>
  );
};

export default Captcha;
