// TranslateWidget.js
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const TranslateWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Helmet>
        <script type="text/javascript">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
            }
          `}
        </script>
      </Helmet>

      <div id="google_translate_element"></div>
    </>
  );
};

export default TranslateWidget;
