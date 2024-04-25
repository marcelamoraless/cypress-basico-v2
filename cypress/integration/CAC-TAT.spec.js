// CAC-TAT.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
   //Sempre vai rodar esta linha antes de qualquer caso de teste
   beforeEach(function(){
      cy.visit('./src/index.html')
   })

 it('Verifica o título da aplicação', function(){
    cy.visit('./src/index.html')

    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
 })

 //Caso de teste com mensagem de aprovação 
 it('Preenche os campos obrigatórios e envia o formulário', function(){
   const longtext = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
   cy.get('#firstName').type('Marcela')
   cy.get('#lastName').type('Morales')
   cy.get('#email').type('marceladefranceschi@hotmail.com')
   cy.get('#open-text-area').type(longtext, {delay: 0}) //delay serve para diminuir o tempo de digitação
   //cy.get('#open-text-area').type('Teste de automação')
   cy.get('button[type="submit"]').click()
   //cy.get('.button').click() pegando do cypress

   cy.get('.success').should('be.visible')
 })

 //Caso de teste com mensagem de erro
 it('Exibe mensagem de erro ao submeter o formulário com um e-mail com formatação inválida', function(){
   cy.get('#firstName').type('Marcela')
   cy.get('#lastName').type('Morales')
   cy.get('#email').type('zerozerozero')
   cy.get('#open-text-area').type('Teste de automação')
   cy.get('button[type="submit"]').click()

   cy.get('.error').should('be.visible')
 })

 //Caso de teste para verificar se o campo continua vazio após digitado valor diferente do esperado
 it('Testando o campo telefone', function(){
   cy.get('#phone')
      .type('abcedfestsd')
      .should('have.value', '')
 })

 //Selecionando um checkbox e transformando um campo em obrigatorio, sem preenche-lo
 it('Campo obrigatorio erro quando não esta preenchido', function(){
   cy.get('#firstName').type('Marcela')
   cy.get('#lastName').type('Morales')
   cy.get('#email').type('marcela@hotmail.com')
   cy.get('#phone-checkbox').check()
   cy.get('#open-text-area').type('Teste de automação')
   cy.get('button[type="submit"]').click()
 })

 //Caso de teste para limpar os campos após preenchidos e confirmar que está limpo (.clear())
 it('Preenche e limpa os campos nome, sobrenome, email e telefone', function(){
   cy.get('#firstName')
      .type('Marcela')
      .should('have.value', 'Marcela') //verificando que realmente está o que foi digitado, caso seja diferente irá acusar erro
      .clear().should('have.value', '') //limpa e verifica se realmente está limpo
   cy.get('#lastName')
      .type('Morales')
      .should('have.value', 'Morales')
      .clear().should('have.value', '')
   cy.get('#email')
      .type('marcela@hotmail.com')
      .should('have.value', 'marcela@hotmail.com')
      .clear().should('have.value', '')
   cy.get('#phone')
      .type('99999999')
      .should('have.value', '99999999')
      .clear().should('have.value', '')
 })

 //Caso de teste para preencher e enviar o formulário sem preencher os campos obrigatórios
 it('Exibe mensagem de erro ao submeter o formulário sem os campos obrigatórios', function(){
   cy.get('#phone').type('99999999')
   cy.get('#email-checkbox').click()
   cy.get('button[type="submit"]').click() //cy.contains('button', 'Enviar').click()
   cy.get('.error').should('be.visible')
 })

 //Caso de teste para chamar um comando customizado
 it('Enviar formulário com comando customizado', function(){
   cy.preencherEnviar() //na aba commands.js

   cy.get('.success').should('be.visible')
 })

 //Selecionando opção em menu suspenso por texto
 it('Seleciona um produto por texto', function(){
   //.select('Nome texto') ('valor') select(x)
   cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube') //confirmação do valor
 })

 //Selecionando opção em menu suspenso por valor(value)
 it('Seleciona um produto por value', function(){
   cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
 })

 //Selecionando opção em menu suspenso pelo índice(numero no menu)
 it('Seleciona um produto pelo índice', function(){
   cy.get('#product')
      .select(1)
      .should('have.value', 'blog') //confirmação do valor 
 })

 //Para lidar com input do tipo radio(somente uma opção), usar .check()<-melhor opção ou .click()
 it('Marcando o tipo de atendimento Feedback', function(){
   cy.get('input[type="radio"][value="feedback"]') //inspecionar pelo chrome, tipo e valor
      .check()
      .should('have.value', 'feedback')
 })

 //Marcando todos os tipos de atendimento
 it('Marcando todos os tipos de atendimento', function(){
   cy.get('input[type="radio"]') //seleciona todas as opções do tipo radio, sem especifico
      .should('have.length', 3) //3 é o valor que deve passar 
      .each(function($radio) { //recebe a função de callback, recebendo cada item de seleção(radio)
         cy.wrap($radio).check() //serve para empacotar cada item deste tipo
         cy.wrap($radio).should('be.checked') //verifica se todos foram selecionados
      })
 })

 //Marcando todos os checkbox e desmarcando o ultimo(utilizando .check() e .uncheck())
 it('Marcando checkbox e desmarcando o último', function(){
   cy.get('input[type="checkbox"')
      .check() //vai selecionar todos os checkbox
      .should('be.checked')
      .last()  //seleciona o ultimo
      .uncheck()
      .should('not.be.checked')
 })

 //Fazendo o upload de arquivos na automação
 it('Selecionando um arquivo para upload', function(){
   cy.get('#file-upload') //'input[type="file"]#file-upload'
      .should('not.have.value') //verificando q nenhum arquivo foi enviado
      .selectFile('./cypress/fixtures/example.json')
      .should(function($input){ //passando uma função e recebendo como argumento o input do tipo file
         expect($input[0].files[0].name).to.equal('example.json')
      })
 })

 //Arrastando um arquivo para upload ao inves de selecionar
 it('Selecionando arquivo por drag-and-drop', function(){
   cy.get('#file-upload') 
      .should('not.have.value') 
      .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
      .should(function($input){ 
         expect($input[0].files[0].name).to.equal('example.json')
      })
 })

 //Selecionando um arquivo através de um ailas
 it('Seleciona um arquivo utilizando uma fixture', function(){
   cy.fixture('example.json').as('sampleFile')
   cy.get('input[type="file"]')
      .selectFile('@sampleFile')
      .should(function($input){
         expect($input[0].files[0].name).to.equal('example.json')
      })
 })

 //Lidando com links que abrem em outra aba - target = blank abre em outra aba
 it('Verificando que a política de privacidade abre em outra aba sem click', function(){
   cy.get('#privacy a').should('have.attr', 'target', '_blank') //attr = atributo
 })

 //Acessando a política de privacidade na mesma aba
 it.only('Acessando a política de privacidade sem target', function(){
   cy.get('#privacy a')
      .invoke('removeAttr', 'target') //remove o target para poder abrir a nova aba na mesma aba
      .click()
 })

 
})