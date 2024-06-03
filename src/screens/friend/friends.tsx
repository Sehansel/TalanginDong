import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import * as FriendService from 'src/services/friendService';

interface IFriendsProps {}

export const FriendsScreen: React.FC<IFriendsProps> = observer(function FriendsScreen(props) {
  const friendsStore = useLocalObservable(() => ({
    list: [{}],
    refreshing: false,
    setFriends(data: any[]) {
      this.list = data;
    },
    setRefreshing(state: boolean) {
      this.refreshing = state;
    },
  }));

  async function callService() {
    friendsStore.setRefreshing(true);
    const response = await FriendService.list();
    friendsStore.setFriends(response.data.data);
    console.log(response);
    friendsStore.setRefreshing(false);
  }

  React.useEffect(() => {
    callService();
  }, []);

  const items = [
    {
      title: 'A',
      data: [
        {
          id: '6',
          task: 'Make a section list tutorial',
        },
        {
          id: '7',
          task: 'Share this tutorial',
        },
        {
          id: '8',
          task: 'Ask doubt in the Comments',
        },
        {
          id: '9',
          task: 'Subscribe to logrocket',
        },
        {
          id: '10',
          task: 'Read next Article',
        },
        {
          id: '11',
          task: 'Read next Article 2',
        },
        {
          id: '12',
          task: 'Read next Article 3',
        },
        {
          id: '13',
          task: 'Read next Article 4',
        },
        {
          id: '14',
          task: 'Read next Article 5',
        },
        {
          id: '15',
          task: 'Read next Article 6',
        },
        {
          id: '16',
          task: 'Read next Article 7',
        },
        {
          id: '17',
          task: 'Read next Article 8',
        },
        {
          id: '18',
          task: 'Read next Article 9',
        },
        {
          id: '19',
          task: 'Read next Article 10',
        },
      ],
    },
    {
      title: 'B',
      data: [
        {
          id: '6',
          task: 'Make a section list tutorial',
        },
        {
          id: '7',
          task: 'Share this tutorial',
        },
        {
          id: '8',
          task: 'Ask doubt in the Comments',
        },
        {
          id: '9',
          task: 'Subscribe to logrocket',
        },
        {
          id: '10',
          task: 'Read next Article',
        },
        {
          id: '11',
          task: 'Read next Article 2',
        },
        {
          id: '12',
          task: 'Read next Article 3',
        },
        {
          id: '13',
          task: 'Read next Article 4',
        },
        {
          id: '14',
          task: 'Read next Article 5',
        },
        {
          id: '15',
          task: 'Read next Article 6',
        },
        {
          id: '16',
          task: 'Read next Article 7',
        },
        {
          id: '17',
          task: 'Read next Article 8',
        },
        {
          id: '18',
          task: 'Read next Article 9',
        },
        {
          id: '19',
          task: 'Read next Article 10',
        },
      ],
    },
    {
      title: 'C',
      data: [
        {
          id: '6',
          task: 'Make a section list tutorial',
        },
        {
          id: '7',
          task: 'Share this tutorial',
        },
        {
          id: '8',
          task: 'Ask doubt in the Comments',
        },
        {
          id: '9',
          task: 'Subscribe to logrocket',
        },
        {
          id: '10',
          task: 'Read next Article',
        },
        {
          id: '11',
          task: 'Read next Article 2',
        },
        {
          id: '12',
          task: 'Read next Article 3',
        },
        {
          id: '13',
          task: 'Read next Article 4',
        },
        {
          id: '14',
          task: 'Read next Article 5',
        },
        {
          id: '15',
          task: 'Read next Article 6',
        },
        {
          id: '16',
          task: 'Read next Article 7',
        },
        {
          id: '17',
          task: 'Read next Article 8',
        },
        {
          id: '18',
          task: 'Read next Article 9',
        },
        {
          id: '19',
          task: 'Read next Article 10',
        },
      ],
    },
  ];
  return (
    <>
      <View style={styles.container}>
        <SectionList
          sections={items}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <Avatar.Text label='AA' size={50} />
              <Text style={styles.taskItem}>{item.task}</Text>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
              }}>
              <Text style={styles.taskTitle}>
                {section.title}
                <Divider />
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider />}
          stickySectionHeadersEnabled
          style={styles.section}
          refreshing={friendsStore.refreshing}
          onRefresh={callService}
        />
        <StatusBar style='auto' />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    width: '100%',
  },
  taskItem: {
    padding: 10,
    marginVertical: 15,
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
  },
  taskTitle: {
    backgroundColor: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    elevation: 4,
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
    // width: 35,
  },
});
