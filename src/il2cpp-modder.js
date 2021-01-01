const fs = require("fs");
const Promise = require("bluebird");
const _ = require("lodash");
const DumpLoader = require("./domain/dumpReader");
const ProjectGenerators = require("./domain/projectGenerators");

const rulesPath = process.argv[2];
const rules = require(rulesPath);

const dllInjectorGenerator = new ProjectGenerators.DllInjector(rules);
const gameModderGenerator = new ProjectGenerators.GameModderDll(rules);

DumpReader.load(rules)
.then(dumpReader => {
  return Promise.props({
    methodHooks: Promise.map(rules.hooks.methods, dumpReader.methodHook),
    pathHooks: Promise.map(rules.hooks.paths, dumpReader.pathHook)
  }) 
})
.tap(it => dllInjectorGenerator.generate(it))
.tap(it => gameModderGenerator.generate(it))
