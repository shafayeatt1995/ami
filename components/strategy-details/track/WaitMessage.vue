<template>
  <div
    class="bg-white p-5 text-center text-success centered flex-col gap-10 mt-3 rounded"
  >
    <h3 v-if="waited_seconds < 30" class="text-success">
      Calculating Hit Rate 😊 ...
    </h3>
    <h3 v-else-if="waited_seconds < 60" class="text-success">
      Don't worry, it only takes only 59 seconds 😉 ...
    </h3>
    <h3 v-else-if="waited_seconds < 120" class="text-success">
      Pls be patient, almost there 🐕 ...
    </h3>
    <h3 v-else class="text-success">Pls check back in 10mins 🤕 ...</h3>
    <div class="dot-flashing"></div>
  </div>
</template>

<script>
export default {
  props: {
    waited_seconds: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
/**
 * ==============================================
 * Dot Flashing
 * ==============================================
 */
.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: $success;
  color: $success;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}

.dot-flashing::before,
.dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: $success;
  color: $success;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: $success;
  color: $success;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dotFlashing {
  0% {
    background-color: $success;
  }
  50%,
  100% {
    background-color: $light;
  }
}
</style>
