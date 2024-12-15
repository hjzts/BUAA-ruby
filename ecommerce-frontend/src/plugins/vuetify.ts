import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'light', // 或 'dark'
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          surface: '#FFFFFF',
          'surface-variant': '#96d7d4',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3',
          secondary: '#FF5722',
          surface: '#121212',
          'surface-variant': '#bb6262'
        },
      },
    },
  },
})
