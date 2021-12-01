/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import Footer from '../../components/Footer';

import { whereFilter, whatFilter } from '../../utils/staticData';
import './css/FindCompany.css';
import FindCompanyCard from './FindCompanyCard';
import checkProperties from '../../utils/checkObjectProperties';
import getCompanies from '../../api/company/get';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const FindCompany = () => {
  const query = useQuery();
  const location = useLocation();
  const history = useHistory();

  const [jobFilter, setJobFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companies, setCompanies] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      jobs: jobFilter || null,
      location: locationFilter || null,
    });
    history.push({ pathname: '/reviews', search: `${params.toString()}` });
  };

  const getFilteredCompanies = async () => {
    const queryParams = { page: 1, limit: 10 };
    const locFilter = query.getAll('location');
    const qFilter = query.getAll('jobs');
    if (typeof locFilter === 'string') {
      queryParams.city = locFilter;
    } else if (locFilter.length) {
      queryParams.city = locFilter[0].split(',')[0];
    }
    if (qFilter.length) {
      queryParams.q = qFilter[0];
    }
    if (queryParams.city === 'Any location') {
      queryParams.city = null;
    }
    checkProperties(queryParams);
    const response = await getCompanies(queryParams);
    if (!response) {
      return;
    }
    setCompanies(response.data.nodes);
  };

  useEffect(() => {
    const jobF = query.getAll('jobs');
    const locFilter = query.getAll('location');
    if (!jobF.length && !locFilter.length) {
      return;
    }
    if (location.search && location.search.length > 0) {
      getFilteredCompanies();
    }
  }, [history.location]);

  useEffect(() => {
    const jobF = query.get('jobs');
    const locF = query.get('location');
    if (jobF !== 'null' && jobF !== null && jobF !== undefined && jobF !== '') {
      setJobFilter(jobF);
    }
    if (locF !== 'null' && locF !== null && locF !== undefined && locF !== '') {
      setLocationFilter(locF);
    }
    if (location.search && location.search.length > 0) {
      getFilteredCompanies();
    }
  }, []);

  useEffect(() => {
    getFilteredCompanies();
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '1400px',
          justifyContent: 'flex-start',
          margin: '0 auto',
          alignItems: 'center',
        }}
      >
        <div>
          <div className="findCompany_header">
            <h1 className="header1">Find great places to work</h1>
            <h2 className="header2">
              Get access to millions of company reviews
            </h2>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="findCompany_form">
                <div className="label">
                  <p className="nameLabel">Company name or job title</p>
                  <CustomAutocomplete
                    className="inputLabel"
                    sx={{
                      width: '330px',
                      marginLeft: '5px',
                      marginTop: '10px',
                    }}
                    variant="outlined"
                    value={jobFilter}
                    setValue={setJobFilter}
                    options={whatFilter}
                    endAdornmentIcon={(
                      <div style={{ marginRight: '15px', marginTop: '5px' }}>
                        <SearchIcon className="iconsinput" />
                      </div>
                    )}
                  />
                </div>
                <div className="label">
                  <p className="nameLabel">City, state, or zip(optional)</p>
                  <CustomAutocomplete
                    className="inputLabel"
                    sx={{
                      width: '330px',
                      marginLeft: '5px',
                      marginTop: '10px',
                    }}
                    variant="outlined"
                    value={locationFilter}
                    setValue={setLocationFilter}
                    options={whereFilter}
                    endAdornmentIcon={(
                      <div style={{ marginRight: '15px', marginTop: '5px' }}>
                        <LocationOnIcon className="iconsinput" />
                      </div>
                    )}
                  />
                </div>
                <button style={{ cursor: 'pointer' }} type="submit" className="findButton">
                  Find Companies
                </button>
              </div>
            </form>
          </div>
          <p
            className="reviewsSalary"
            onClick={() => history.push('/salaries')}
          >
            Do you want to search for salaries?
          </p>

          <p
            style={{
              fontSize: '25px',
              fontWeight: 'bold',
              marginBottom: '-20px',
              marginTop: '30px',
            }}
          >
            Popular Companies
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '69%',
            flexWrap: 'wrap',
            marginLeft: '30px',
          }}
        >
          {companies
            ? companies.length > 0
              ? companies.map((company) => <FindCompanyCard company={company} />)
              : null
            : null}
        </div>
      </div>
      <div style={{ marginTop: '100px' }}>
        <Footer />
      </div>
    </>
  );
};

export default FindCompany;
