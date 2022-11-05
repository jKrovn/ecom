import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Input from './form-components/Input'

export default class GraphQL extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      isLoaded: false,
      error: null,
      alert: {
        type: 'd-none',
        message: '',
      },
      searchTerm: '',
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (evt) => {
    let value = evt.target.value
    this.setState((prevState) => ({
      searchTerm: value,
    }))
    if (value.length > 2) {
      this.performSearch()
    } else {
      this.setState({
        movies: [],
      })
    }
  }

  performSearch() {
    const payload = `
    {
        search(titleContains: "${this.state.searchTerm}") {
            id
            title
            runtime
            year
            description
        }
    }
    `
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'POST',
      body: payload,
      headers: myHeaders,
    }
    fetch('http://localhost:4000/v1/graphql', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let theList = Object.values(data.data.search)
        return theList
      })
      .then((theList) => {
        console.log(theList)
        if (theList.length > 0) {
          this.setState({
            movies: theList,
          })
        } else {
          this.setState({
            movies: [],
          })
        }
      })
  }

  componentDidMount() {
    const payload = `
    {
        list {
            id
            title
            runtime
            year
            description
        }
    }
    `
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'POST',
      body: payload,
      headers: myHeaders,
    }
    fetch('http://localhost:4000/v1/graphql', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let theList = Object.values(data.data.list)
        return theList
      })
      .then((theList) => {
        this.setState({
          movies: theList,
        })
        console.log(theList)
      })
  }
  render() {
    let { movies } = this.state
    return (
      <Fragment>
        <h2>GraphQL</h2>
        <hr />
        <Input
          title={'Search'}
          type={'text'}
          name={'search'}
          value={this.state.searchTerm}
          handleChange={this.handleChange}
        />
        <div className='list-group'>
          {movies.map((m) => (
            <Link
              key={m.id}
              className='list-group-item list-group-item-action'
              to={`/moviesgraphql/${m.id}`}
            >
              <strong>{m.title}</strong>
              <br />
              <small className='text-muted'>
                ({m.year}) - {m.runtime} minutes
              </small>
              <br />
              {m.description.slice(0, 100)}...
            </Link>
          ))}
        </div>
      </Fragment>
    )
  }
}
