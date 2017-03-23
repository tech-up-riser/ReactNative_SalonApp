import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  ListView,
  View,
  Text,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import Appointment from '../components/Appointment'
import Moment from 'moment'
import CloseButton from '../components/CloseButton'
import { NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, STATUS_BAR_COLOR } from '../constants'
import { getPast } from '../selectors/AppointmentsSelector'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'

const data = {
  type: 'past',
  iconColor: '#72BED5'
}

class PastAppointments extends Component {

  constructor (props) {
    super(props)
    this.state = {
      appointments: [],
      dataSource: new ListView.DataSource({
        getSectionData: this.getSectionData,
        getRowData: this.getRowData,
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    }
  }

  componentWillMount () {
    this.setState({
      past: getPast(this.props.user)
    })
  }

  componentDidMount () {
    this.prepareData()
  }

  getSectionData (dataBlob, sectionID) {
    return dataBlob[ sectionID ]
  }

  getRowData (dataBlob, sectionID, rowID) {
    return dataBlob[ sectionID + ':' + rowID ]
  }

  prepareData () {
  //  let data = this.props.appointments
    const data = this.state.past
    const dataBlob = {}
    const sectionIDs = []
    const rowIDs = []
    for (let dataItem of data) {
      const sectionID = Moment(dataItem.booking).format('MMMM, YYYY')
      const sectionIDIndex = sectionIDs.indexOf(sectionID)
      if (typeof dataBlob[ sectionID ] === 'undefined') {
        dataBlob[ sectionID ] = { title: sectionID }
        sectionIDs.push(sectionID)
        rowIDs.push([ dataItem.id ])
      } else rowIDs[ sectionIDIndex ].push(dataItem.id)
      dataBlob[ sectionID + ':' + dataItem.id ] = dataItem
    }
    this.setState({ dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs) })
  }

  renderRow (row) {
    const salon = this.props.salons[row.salonId]
    const b = {
      booking: row.booking,
      address: salon.address,
      name: salon.name,
      id: row.id,
      dateCanceled: row.dateCanceled
    }
    return <Appointment data={data} styles={appointmentStyles} item={b} />
  }

  renderSectionHeader (sectionData, sectionID) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionContent}>{sectionID.toUpperCase()}</Text>
      </View>
    )
  }

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        <CloseButton onClick={() => this.props.navigator.dismissModal({})} />
        <Text style={styles.navTitle}>Past Appointments</Text>
        <View style={{flex: 1}} />
      </View>
    )
  }

  renderEmptyMessage () {
    return (
      <View style={styles.emptyContainer}>
        <Image source={require('../assets/images/hairdryer.png')} style={styles.hairdryer} />
        <Text style={styles.emptyText}>
          You have no past Vurve appointments.
        </Text>
      </View>
    )
  }

  render () {
    let dataSource = this.state.dataSource
    console.log('past appointments dataSource', dataSource)
    return (
      <View style={styles.container}>
        <View style={styles.statusBar}/>
        {this.renderNavBar()}
        {
          (dataSource.sectionIdentities && dataSource.sectionIdentities.length > 0) ?
            <ListView
              dataSource={dataSource}
              renderRow={this.renderRow.bind(this)}
              renderSectionHeader={this.renderSectionHeader} />
          : this.renderEmptyMessage() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: STATUS_BAR_COLOR
  },
  navBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    height: NAVIGATOR_HEIGHT,
    zIndex: 1
  },
  navTitle: {
    flex: 4,
    fontSize: getFontSize(14),
    color: '#4A4A4A',
    fontWeight: '300',
    textAlign: 'center'
  },
  header: {
    borderTopWidth: 2,
    borderTopColor: 'gainsboro',
    borderBottomWidth: 2,
    borderBottomColor: 'gainsboro',
    height: dynamicSize(45),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  headerTextContainer: {
    alignItems: 'center',
    flex: 1
  },
  headerText: {},
  profile: {
    height: dynamicSize(25),
    position: 'absolute',
    right: 0,
    top: dynamicSize(8)
  },
  sectionHeader: {
    backgroundColor: '#EAEAED',
    height: dynamicSize(25),
    justifyContent: 'center',
    marginTop: dynamicSize(25)
  },
  sectionContent: {
    marginLeft: dynamicSize(20),
    fontSize: getFontSize(12),
    color: '#666666'
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 8
  },
  emptyText: {
    fontSize: getFontSize(16),
    color: '#666666'
  },
  hairdryer: {
    width: dynamicSize(50),
    height: dynamicSize(50),
    marginBottom: 40
  }
})

const appointmentStyles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'gainsboro',
    height: dynamicSize(130),
    flexDirection: 'row',
    paddingTop: dynamicSize(20),
    paddingBottom: dynamicSize(20)
  },
  content: {
    marginLeft: dynamicSize(35),
    justifyContent: 'center',
    flex: dynamicSize(8)
  },
  name: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: '#333333'
  },
  address: {
    flex: 2,
//    paddingTop: 5,
//    paddingBottom: 27,
    fontSize: getFontSize(14),
    color: '#5B5D68'
  },
  date: {
    flex: 2,
    fontSize: getFontSize(12),
    color: '#72BED5'
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  canceledMessage: {
    flex: 1,
    color: 'red',
    fontSize: getFontSize(12),
    fontWeight: '300'
  }
})

PastAppointments.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  salons: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user,
  salons: state.salons
})

export default connect(mapStateToProps)(PastAppointments)
