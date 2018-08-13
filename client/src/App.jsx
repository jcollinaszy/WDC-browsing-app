import React, { Component } from 'react'
import CustomTable from './Components/CustomTable'
import CircularProgress from '@material-ui/core/CircularProgress'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Icon from '@material-ui/core/Icon'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Divider from '@material-ui/core/Divider'
import Dialog from '@material-ui/core/Dialog'
import Input from '@material-ui/core/Input'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableRow'

import './App.css'

class App extends Component {
  state = {
    data: [],
    filteredData: [],
    selectedData: {},
    filter: '',
    page: 0,
    open: false,
    switches: {
      RELATION: true,
      ENTITY: true,
      MATRIX: true,
      LAYOUT: true,
      OTHER: true
    }
  }

  dataPerPage = 10

  componentDidMount () {
    this.callApi()
      .then(res => this.setState({ filteredData: res.data, data: res.data }))
      .catch(err => console.log(err))
  }

  callApi = async () => {
    const response = await fetch('/api/data')
    const body = await response.json()

    if (response.status !== 200) throw Error(body.message)

    return body
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleSwitchChange = name => event => {
    let sw = { ...this.state.switches }
    sw[name] = event.target.checked
    let filtered = this.state.data.filter(
      datum =>
        datum.pageTitle.toLowerCase().indexOf(this.state.filter) >= 0 &&
        sw[datum.tableType]
    )
    this.changePage(0)
    this.setState({ switches: { ...sw }, filteredData: filtered, page: 0 })
  }

  handleSearchChange = () => event => {
    let filter = event.target.value.toLowerCase()
    let filtered = this.state.data.filter(
      datum =>
        datum.pageTitle.toLowerCase().indexOf(filter) >= 0 &&
        this.state.switches[datum.tableType]
    )
    this.changePage(0)
    this.setState({ filteredData: filtered, filter: filter })
  }

  handleInputChange = () => event => {
    let page = parseInt(event.target.value, 10)
    if (page < 1 || isNaN(page)) page = 1
    if (page > Math.ceil(this.state.filteredData.length / this.dataPerPage)) { page = Math.ceil(this.state.filteredData.length / this.dataPerPage) }
    this.setState({ page: page - 1 })
  }

  changePage = page => event => {
    if (page < 1) page = 0
    if (page >= Math.ceil(this.state.filteredData.length / this.dataPerPage)) { page = Math.ceil(this.state.filteredData.length / this.dataPerPage) - 1 }
    this.setState({ page: page })
  }

  render () {
    return (
      <div className='App'>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          onClick={() => this.setState({ open: false })}
        >
          <CustomTable data={this.state.selectedData} />
        </Dialog>
        <header className='App-header'>
          <h1
            className='App-title'
            onClick={() => this.setState({ open: true })}
          >
            WDC Web Table Corpus (2015) Browsing App
          </h1>
          <div>
            Table Type : {' '}
            {Object.keys(this.state.switches).map((sw, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Switch
                    checked={this.state.switches[sw]}
                    onChange={this.handleSwitchChange(sw)}
                    value={sw}
                    color='primary'
                  />
                }
                label={sw}
              />
            ))}
            <TextField
              id='search'
              label='Search'
              type='search'
              onChange={this.handleSearchChange()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <Icon>search</Icon>
                  </InputAdornment>
                )
              }}
            />
          </div>
        </header>
        <Divider />
        <div className='tableSpace'>
          {this.state.data.length > 0
            ? <Table className='tableMain'>
              <TableHead className='tableHead'>

                <TableCell>Page Title</TableCell>
                <TableCell>Table Number</TableCell>
              </TableHead>
              <TableBody>
                {this.state.filteredData
                    .slice(
                      this.state.page * this.dataPerPage,
                      (this.state.page + 1) * this.dataPerPage
                    )
                    .map((datum, index) => (
                      <TableRow
                        className='mainRow'
                        key={index}
                        button
                        onClick={() =>
                          this.setState({
                            open: true,
                            selectedData: { ...datum }
                          })}
                      >
                        <TableCell>{datum.pageTitle}</TableCell>
                        <TableCell>{datum.tableNum}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            : <CircularProgress size={50} />}
        </div>

        <div>
          <Icon className='naviIcon' onClick={this.changePage(0)}>
            first_page
          </Icon>
          <Icon
            className='naviIcon'
            onClick={this.changePage(this.state.page - 1)}
          >
            chevron_left
          </Icon>
          Page
          {' '}
          <Input
            className='currentPage'
            value={this.state.page + 1}
            onChange={this.handleInputChange()}
          />
          {' '}
          of
          {' '}
          {Math.ceil(this.state.filteredData.length / this.dataPerPage)}
          <Icon
            className='naviIcon'
            onClick={this.changePage(this.state.page + 1)}
          >
            chevron_right
          </Icon>
          <Icon
            className='naviIcon'
            onClick={this.changePage(
              Math.ceil(this.state.filteredData.length / this.dataPerPage) - 1
            )}
          >
            last_page
          </Icon>
        </div>
      </div>
    )
  }
}

export default App
