import React from 'react';

const OpenGraphTags: React.FC = () => {
  return (
    <React.Fragment>
      <meta property="og:url" content="https://opticamultivison.cl" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Óptica Multivision" />
      <meta
        property="og:description"
        content="Óptica Multivision: catálogo visual, promociones, contacto, ubicación y cotización directa por WhatsApp."
      />
      <meta property="og:image" content="/assets/images/black-logo.png" />
    </React.Fragment>
  );
};

export default OpenGraphTags;
