import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

/**
 * TranslateWidget Component - Renders a widget for translating the page using Google Translate.
 * @component
 * @returns {JSX.Element} - Rendered component.
 */
const TranslateWidget = () => {
  useEffect(() => {
    /**
     * Dynamically creates and appends the Google Translate script to the document head.
     * Also removes the script on component unmount to clean up.
     */
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
            /**
             * Initialization function for the Google Translate widget.
             */
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
