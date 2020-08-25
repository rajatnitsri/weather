import { create } from 'apisauce'


  export default api = create({
    baseURL: 'http://api.openweathermap.org',
    headers: { Accept: 'application/vnd.github.v3+json' },
  })

