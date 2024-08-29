Este proyecto usa las tecnologias de MongoDB y Moongose, una api ya realizada de FakeStore, express.js y node.js.

Antes de iniciar se debe instalar las dependencias para esto en la terminal se pondra

npm install express axios mongoose body-parser nodemon --save && npm install jest supertest --save-dev


Para iniciar el servidor se debe abrir la terminal de VsCode y escribir "node app.js"

Para hacer las pruebas se debe abrir la terminal de VsCode y escribir "npm test" esta trabajará el status del server y los metodos HTTP

y para hacer las pruebas de compatibilidad y capacidad de usuarios se debe colocar en la terminal de VsCode "artillery run load-test-config.yml"
