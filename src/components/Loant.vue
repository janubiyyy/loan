<template>
  <div>
    <h1>Loan Details</h1>
    <p>Borrower: {{ loan }}</p>
    <p>Repayment Schedule: {{ loan.schedule }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loan: {},
    };
  },
};
</script>
