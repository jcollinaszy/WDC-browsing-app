import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'

export default class CustomTable extends Component {
  render () {
    return (
      <div>
        <header className='modalHeader'>
          <h3 className='modalTitle'>{this.props.data.pageTitle}</h3>
          <Grid container spacing={24}>
            <Grid item xs={1}>
              <Typography>
                {' '}URL : <br /> Table Number : <br /><br />{' '}
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <Typography>
                {' '}
                <a href={this.props.data.url} target='_blank'>
                  {this.props.data.url}
                </a>
                {' '}
                <br />
                {' '}
                {this.props.data.tableNum}
              </Typography>
            </Grid>
          </Grid>
          <h4 className='tableTitle'>Table</h4>
        </header>
        <Divider />
        <Table className='modalTable'>
          <TableBody>
            {this.props.data &&
              this.props.data.relation.map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell, index) => (
                    <TableCell key={index}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}
