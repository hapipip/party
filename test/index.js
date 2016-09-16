'use strict';

const Lab =  require('lab');
const Hapi = require('hapi');
const Path = require('path');
const {expect} = require('code');
const {describe, it, beforeEach} = exports.lab = Lab.script();

describe('Party time', () => {
  let server;

  beforeEach(done => {
    server = new Hapi.Server();
    server.connection();
    done();
  });

  it('Loading models', done => {
    server.register({
      register: require('../lib/index'),
      options: {
        defaultStore: 'simple',
        cache: Path.join(__dirname, 'cache'),
        models: [Path.join(__dirname, 'fixtures', 'models')],
        stores: {
          simple: {
            adapter: 'memory'
          }
        }
      }
    }, err => {
      expect(err).to.not.exist();

      server.start(err => {
        expect(err).to.not.exist();

        expect(server.collections).to.exist();
        const Person = server.collections(true).person;
        expect(Person).to.exist();

        Person.create({name: 'Ga'});
        // Person.findOne(1).exec((err, Ga) => {
        //   expect(err).to.not.exist();
        //
        //   console.log(err, Ga);
        //   expect(Ga).to.exist();
        //   expect(Ga.name).to.be.equal('Ga');
        // });
        done();
      });
    });
  });
});
