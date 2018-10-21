<template>
  <div>
    <h1>Demo for Socket.io-client Vuex Plugin</h1>
    <div class="main">

      <div class="btn-group">
        <b-button-group vertical>
          <b-button
            @click="socketConnect()">Socket Connect
          </b-button>
        </b-button-group>
      </div>

      <div class="send-box">
        <div class="input-form">
          <b-button @click="sendMessage()" variant="outline-success">Submit</b-button>
          <b-form-input v-model="sendMessageInput"
                        type="text"
                        placeholder="Enter message"></b-form-input>
        </div>
      </div>
    </div>

    <div class="logs">
      <div class="logs-header">Event Log</div>
      <div class="logs-box">
        {{applicationsSession}}
        <br><br>
        {{devices}}
        <!--<b-list-group>-->
          <!--<b-list-group-item v-for="message in socketMessages">{{message}}</b-list-group-item>-->
        <!--</b-list-group>-->
      </div>
    </div>

  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';

  export default {
    name: 'app',
    data() {
      return {
        sendMessageInput: '',
        nspSendMessageInput: '',
      }
    },
    computed: {
      ...mapState('devicesModule', ['devices', 'applicationsSession'])
    },
    methods: {
      ...mapActions('devicesModule', ['socketConnect', 'socketEmit_joinSession']),
      sendMessage() {
        if (this.sendMessageInput !== '') {
          this.socketEmit_joinSession(this.sendMessageInput);
          this.sendMessageInput = '';
        }
      }
    }
  }
</script>

<style scoped>
  h1 {
    margin-top: 30px;
    text-align: center;
  }

  .main {
    display: flex;
  }

  .btn-group {
    flex-basis: 20%;
    margin: 10px;
    justify-content: center;
    align-items: baseline;
  }

  .send-box {
    flex-basis: 35%;
    margin: 10px;
    padding-right: 10px;
  }

  .input-form {
    display: flex;
  }

  .input-form .btn {
    margin-right: 10px;
    display: inline-block;
  }

  .send-box .form-control {
    display: inline-block;
  }

  .message-box {
    margin-top: 10px;
  }

  .message-box .list-group-item {
    padding-top: 6px;
    padding-bottom: 6px;
    text-align: center;
  }

  .response-box {
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  .logs {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .logs-header {
    text-align: center;
    font-size: 2rem;
    margin: 20px;
  }

  .logs-box {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .logs-box .list-group {
    width: 500px;
  }

</style>
