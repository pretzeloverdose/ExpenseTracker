import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const createGlobalStyles = (primaryColor: string) =>
  StyleSheet.create({
    // Shared
    navText: { color: '#fff' },
    whiteText: { color: '#fff' },

    primaryColor: { color: primaryColor },

    // Navigation buttons (horizontal and vertical)
    navigationBtn: {
      padding: 8,
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: primaryColor,
      borderRadius: 5,
      marginRight: 6,
      marginLeft: 0,
      marginBottom: 12,
      margin: 0,
      alignItems: 'center',
      textAlign: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      width: 120,
      flex: 2,
    },
    iconButton: {
      alignItems: 'center',
      backgroundColor: primaryColor,
      color: '#fff',
    },

    // WeekCalendar
    AppWrap: { height: SCREEN_HEIGHT },
    selectedCalStyle: { backgroundColor: primaryColor },
    spaceBEtween: { justifyContent: 'space-between' },
    navigation: {
      padding: 25,
      paddingBottom: 80,
      display: 'flex',
      flexWrap: 'nowrap',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    weekContainer: {
      flex: 1,
      width: SCREEN_WIDTH,
      backgroundColor: primaryColor,
      padding: 16,
    },
    daysContainer: {
      margin: 6,
      marginTop: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dayContainer: {
      alignItems: 'center',
      padding: 4,
    },
    dayPanelWrapper: { flex: 1 },
    dayName: { fontSize: 12, color: '#444' },
    dayNumber: { fontSize: 12, color: '#444', fontWeight: '500' },
    dateText: { marginLeft: 8, fontSize: 14, color: '#fff' },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    calendarContainer: {
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
      width: '90%',
      maxWidth: 500,
    },
    closeButton: {
      marginTop: 15,
      padding: 10,
      backgroundColor: primaryColor,
      borderRadius: 5,
      alignSelf: 'flex-end',
    },
    closeButtonText: { fontSize: 12, color: '#fff' },
    dateContainer: { alignItems: 'center' },
    dotsContainer: { flexDirection: 'row', marginTop: 4 },
    dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2 },

    // Search
    container: { flex: 1, padding: 16 },
    input: {
      height: 43,
      borderColor: '#ccc',
      backgroundColor: '#fff',
      borderWidth: 1,
      paddingHorizontal: 12,
      borderRadius: 8,
      flex: 6,
    },
    item: {
      padding: 12,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: '#fff',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    },
    leftCol: { flex: 1, flexShrink: 1 },
    rightCol: { flexShrink: 0, alignItems: 'flex-end' },
    name: { color: '#444', flexWrap: 'wrap' },
    amount: { color: '#444', fontWeight: 'bold' },
    delete: { marginTop: 4, color: 'red' },

    // MenuComponent
    menuNavigation: {
      paddingTop: 10,
      display: 'flex',
      flexWrap: 'nowrap',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuNavigationBtn: {
      padding: 12,
      backgroundColor: primaryColor,
      borderRadius: 5,
      marginBottom: 8,
      width: 240,
    },
    centerText: { textAlign: 'center' },

    // Screens (Home, Add, Edit, Search)
    screenContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
    },
    title: {
      fontSize: 16
    },
    screenButton: {
      backgroundColor: '#007bff',
      padding: 15,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    screenButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
    blackText: {
      color: '#000',
      fontWeight: 'bold',
    },
    dayPanelDate: {
      fontSize: 12,
      padding: 8,
      paddingTop: 0,
      paddingBottom: 12,
      color: '#666',
    },
    dayPanelItem: {
      marginBottom: 5,
      marginRight: 15,
      backgroundColor: 'white',
      borderRadius: 4,
      flexDirection: 'row',
    },
    highlightedPanel: {
      borderColor: primaryColor,
      borderWidth: 1,
    },
    dayPanelDay: {
      fontSize: 12,
      fontWeight: '600',
      color: '#666',
      padding: 8,
      alignSelf: 'center',
      paddingBottom: 0,
    },
    dayPanelContainer: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      padding: 16,
    },
    weekTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    dayPanelContent: {
      flexDirection: 'column',
      flex: 1,
    },
    dayText: {
      flexDirection: 'column',
    },
    dayInfo: {
      padding: 8,
      marginRight: 35,
      borderLeftWidth: 1,
      borderColor: '#f5f5f5',
      fontSize: 12,
    },
    dayInfoStyle: {
      fontSize: 12,
      color: '#666',
    },
  });

export default createGlobalStyles;