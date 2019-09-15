import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const SectionContainer = ({titleText, children}) => {
  return (
    <View style={styles.sectionContainer}>
      {titleText && <Text style={styles.sectionTitle}>{titleText}</Text>}
      <View style={styles.sectionDescription}>{children}</View>
    </View>
  );
};

export default SectionContainer;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
  },
});
