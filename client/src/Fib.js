import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
    loading: true,
    error: null
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const values = await axios.get('/api/values/current');
      this.setState({ values: values.data });
    } catch (error) {
      this.setState({ error: 'Error fetching values' });
      console.error('Error fetching values:', error);
    }
  }

  async fetchIndexes() {
    try {
      const seenIndexes = await axios.get('/api/values/all');
      // Ensure seenIndexes.data is an array
      const indexes = Array.isArray(seenIndexes.data) ? seenIndexes.data : [];
      this.setState({
        seenIndexes: indexes,
        loading: false
      });
    } catch (error) {
      this.setState({ 
        error: 'Error fetching indexes',
        loading: false 
      });
      console.error('Error fetching indexes:', error);
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      await axios.post('/api/values', {
        index: this.state.index,
      });
      this.setState({ index: '' });
      
      // Refetch values and indexes after submitting
      await this.fetchValues();
      await this.fetchIndexes();
    } catch (error) {
      this.setState({ error: 'Error submitting value' });
      console.error('Error submitting:', error);
    }
  };

  renderSeenIndexes() {
    if (!Array.isArray(this.state.seenIndexes)) {
      return 'No indexes available';
    }
    return this.state.seenIndexes.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const entries = [];
    const values = this.state.values || {};

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    if (this.state.error) {
      return <div>Error: {this.state.error}</div>;
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button type="submit">Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;