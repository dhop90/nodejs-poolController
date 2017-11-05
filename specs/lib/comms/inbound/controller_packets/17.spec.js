describe('processes 17 (Schedule) packets', function() {
  var data = [
    Buffer.from([255, 0, 255, 165, 16, 15, 16, 17, 7, 1, 6, 9, 25, 15, 55, 255, 2, 90])
  ]

  var equip = 'controller'

  describe('#When packets arrive', function() {
    context('via serialport or Socat', function() {

      before(function() {
        bottle.container.settings.logConfigMessages = 1
        bottle.container.logger.transports.console.level = 'silly';
      });

      beforeEach(function() {
        sandbox = sinon.sandbox.create()
        clock = sandbox.useFakeTimers()
        queuePacketStub = sandbox.stub(bottle.container.queuePacket, 'queuePacket')
        circuitNameStub = sandbox.stub(bottle.container.circuit, 'getCircuitName').returns("POOL")
        loggerInfoStub = sandbox.stub(bottle.container.logger, 'info')
        loggerWarnStub = sandbox.stub(bottle.container.logger, 'warn')
        loggerVerboseStub = sandbox.stub(bottle.container.logger, 'verbose')
        loggerDebugStub = sandbox.stub(bottle.container.logger, 'debug')
        loggerSillyStub = sandbox.stub(bottle.container.logger, 'silly')
        bottle.container.schedule.init()
      })

      afterEach(function() {
        sandbox.restore()

      })

      after(function() {
        bottle.container.settings.logConfigMessages = 0
        bottle.container.logger.transports.console.level = 'info';
      })

      it('#Schedule 1 should have ID:1 START_TIME:9:25', function() {
        bottle.container.packetBuffer.push(data[0])
        clock.tick(1000)
        var json = bottle.container.schedule.getCurrentSchedule()
        //console.log('json for schedule 1: ', JSON.stringify(json,null,2))
        json[1].ID.should.equal(1)
        json[1].START_TIME.should.equal("9:25")
        json[1].CIRCUIT.should.equal("POOL")
      })


    })
  })
})