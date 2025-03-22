<script setup lang="ts">
import { restEvents } from "../../../data/rest";
</script>

<template>
  <h3>RESTING EVENTS</h3>
  <p>
    When the party rests outside of a town or safe location, Resting Events may reduce the
    number of actions players can perform during that rest. The number of events is based
    on how many rests the party has taken since leaving a town.
  </p>
  <p><b>First Rest After Leaving:</b> No events.</p>
  <p><b>Second Rest:</b> 1 event.</p>
  <p><b>Third Rest:</b> 2 events, and so on.</p>
  <p>Roll on the Resting Events Table once for each event to determine what occurs.</p>
  <p>
    You should roll on the table after the characters have decided what they will be doing
    during the rest.
  </p>
  <p>
    The Resting Event Count resets to 0 when the party enters a town or fortified safe
    location. If the party leaves again, the event count starts accumulating anew.
  </p>
  <p>Resting events only effect the current rest.</p>

  <div class="goods">
    <div class="good" v-for="(event, index) in restEvents">
      <h4>{{ index + 1 }}. {{ event.name }}</h4>
      <p v-for="desc in event.description">
        {{ desc }}
      </p>
    </div>
  </div>
</template>
