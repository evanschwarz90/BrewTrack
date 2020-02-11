import React from 'react';

class BreweryCard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      photo_url: '',
    }
  }

  render() {
    let {breweryData, index, visited} = this.props;
    return (
      <div className="Brewery-card-box col-xl-3 col-lg-4 col-md-6 col-sm-12" onClick={e => this.props.handleCardClick(e,`breweryCard${index}`, breweryData.name)}>
        <div id={`breweryCard${index}`} className={visited ? "Brewery-card card bg-success" : "Brewery-card card"}>
          <div className="card-header Brewery-card-header">
            <h6 className="card-title">{breweryData.name}</h6>
          </div>
          <div className="card-body">
            <b className="card-text">Address: </b>
            <p className="card-text">
              {`  ${breweryData.street}  ${breweryData.city}, ${breweryData.state}, ${breweryData.postal_code}`}
            </p>
          </div>
          <div className="card-footer">
            <a
              className="card-link float-left"
              href={breweryData.website_url || null}
              onClick={e => e.stopPropagation()}
              target="_blank"
            >
              website
            </a>
            <a
              className="card-link float-right"
              href={`http://maps.google.com/maps?q=${breweryData.name}${breweryData.street}${breweryData.city}${breweryData.state}${breweryData.postal_code}`}
              onClick={e => e.stopPropagation()}
              target="_blank"
            >
              google maps
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default BreweryCard;
