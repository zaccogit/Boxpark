import axios from 'axios';
import enviroments from '../../enviroments.json';

const AxiosEndPointsConfig = axios.create({
  baseURL: enviroments.APP_CONFIG_BASE_API,
});

export default AxiosEndPointsConfig;
