export const swaggerOptions = {

  definition: {
    openapi: "3.0.1",
    info: {
      title: "E-commerce API",
      description: "Desafio de Coderhouse",
    },
  },
  apis: [`src/docs/**/*.yaml`],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{
    bearerAuth: [],
    ApiKeyAuth: []
  }]

}
