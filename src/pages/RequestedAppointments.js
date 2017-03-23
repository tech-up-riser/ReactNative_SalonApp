import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  ListView,
  View,
  Text,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import CloseButton from '../components/CloseButton'
import Appointment from '../components/Appointment'
import Moment from 'moment'
import screens from '../constants/Screens'
import * as _ from 'lodash'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR
} from '../constants'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'

const data = {
  type: 'requested',
  iconColor: '#8F92A3'
}

class RequestedAppointment extends Component {

  constructor (props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({
        getSectionData: this.getSectionData,
        getRowData: this.getRowData,
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    }
  }

  componentDidMount () {
    this.prepareData(this.props)
  }

  componentWillReceiveProps (props) {
    this.prepareData(props)
  }

  getSectionData (dataBlob, sectionID) {
    return dataBlob[ sectionID ]
  }

  getRowData (dataBlob, sectionID, rowID) {
    return dataBlob[ sectionID + ':' + rowID ]
  }

  prepareData (props) {
    const { user, requests } = props
    const dataBlob = {}
    const sectionIDs = []
    const rowIDs = []
    const userRequests = (user.requests) ? user.requests : {}
    const reqArr = []
    for (let reqId in userRequests) {
      const r = requests[reqId]
      if (r) {
        reqArr.push(r)
      }
    }
    console.log('RequestedAppointments, prepare Data', reqArr)
    const sortedReqArr = _.sortBy(reqArr, (o) => o.dateStart)
    _.reverse(sortedReqArr)
    for (let dataItem of sortedReqArr) {
      if (dataItem) {
        let sectionID = Moment(dataItem.dateStart).format('MMMM, YYYY')
        let sectionIDIndex = sectionIDs.indexOf(sectionID)
        if (typeof dataBlob[ sectionID ] === 'undefined') {
          dataBlob[ sectionID ] = { title: sectionID }
          sectionIDs.push(sectionID)
          rowIDs.push([dataItem.id])
        } else rowIDs[ sectionIDIndex ].push(dataItem.id)
        dataBlob[ sectionID + ':' + dataItem.id ] = dataItem
      }
    }
    console.log('prepareData', dataBlob, sectionIDs, rowIDs)
    this.setState({ dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs) })
  }

  handleOnPress (id) {
    console.log('handleOnPress', id)
    const { requests, navigator } = this.props
    const request = requests[id]
    navigator.push({
//    this.props.navigator.showLightBox({
      screen: screens.REQUESTED,
      navigatorStyle: {
        navBarHidden: true
      },
      passProps: {
        request
      }
    })
  }

  renderRow (row) {
    return (
      <Appointment
        data={data}
        styles={appointmentStyles}
        item={row}
        handleOnPress={this.handleOnPress.bind(this)}
      />
    )
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
        <CloseButton onClick={() => this.props.navigator.dismissModal({})}/>
        <Text style={styles.navTitle}>Requested Appointments</Text>
        <View style={{flex: 1}}/>
      </View>
    )
  }

  renderEmptyMessage () {
    return (
      <View style={styles.emptyContainer}>
        <Image source={require('../assets/images/hairdryer.png')} style={styles.hairdryer} />
        <Text style={styles.emptyText}>
          You have no requested Vurve appointments.
        </Text>
      </View>
    )
  }

  render () {
    let dataSource = this.state.dataSource
    console.log('render data Source', dataSource)
    return (
      <View style={styles.container}>
        <View style={styles.statusBar}/>
        {this.renderNavBar()}
        {/* <View style={styles.header}>
          <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Requested Appointments</Text>
          </View>
          <Image style={styles.profile} resizeMode={'contain'} source={require('../../assets/images/Account.png')} />

        </View> */}
        {(dataSource.sectionIdentities && dataSource.sectionIdentities.length > 0) ?
          <ListView
            dataSource={dataSource}
            renderRow={this.renderRow.bind(this)}
            renderSectionHeader={this.renderSectionHeader} />
          : this.renderEmptyMessage()
        }
      </View>
    )
  }
}

// ---
// Fixtures
// ---

const styles = StyleSheet.create({
  container: {
//    marginTop: 20,
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
    fontSize: dynamicSize(14),
    color: '#4A4A4A',
    fontWeight: '300',
    textAlign: 'center'
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
    borderBottomWidth: dynamicSize(1),
    borderBottomColor: 'gainsboro',
    height: dynamicSize(110),
    flexDirection: 'row'
//     paddingTop: 20,
//    paddingBottom: 22
  },
  content: {
    marginLeft: dynamicSize(35),
    justifyContent: 'center',
    flex: 8,
    flexDirection: 'column',
    marginTop: dynamicSize(10),
    marginBottom: dynamicSize(10)
  },
  address: {
    fontSize: getFontSize(14),
    color: '#5B5D68'
  },
  addressContainer: {
    flex: 2,
    justifyContent: 'center'
  },
  rangeContainer: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  range: {
    color: '#8F92A3',
    fontSize: getFontSize(11)
  },
  dateContainer: {
    flex: 2,
    justifyContent: 'center'
  },
  date: {
    color: '#8F92A3',
    fontSize: getFontSize(12)
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  canceledContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  expiredContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  expiredMessage: {
    flex: 1,
    color: 'red',
    fontSize: dynamicSize(12),
    fontWeight: '300'
  }
})

RequestedAppointment.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  requests: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user,
  requests: state.requests
})

export default connect(mapStateToProps)(RequestedAppointment)
