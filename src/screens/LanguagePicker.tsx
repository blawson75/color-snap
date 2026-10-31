import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { languages, LanguageCode } from '../utils/colorNames';

type RootStackParamList = {
  Camera: undefined;
  Snapshot: { imageUri: string; language: LanguageCode };
  LanguagePicker: { currentLanguage: LanguageCode; onSelect: (lang: LanguageCode) => void };
};

type LanguagePickerRouteProp = RouteProp<RootStackParamList, 'LanguagePicker'>;
type LanguagePickerNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LanguagePicker'>;

interface RouteParams {
  currentLanguage: LanguageCode;
  onSelect: (lang: LanguageCode) => void;
}

export const LanguagePicker: React.FC = () => {
  const navigation = useNavigation<LanguagePickerNavigationProp>();
  const route = useRoute<LanguagePickerRouteProp>();
  const { currentLanguage, onSelect } = route.params;

  const languageEntries: [LanguageCode, string][] = Object.entries(languages) as [LanguageCode, string][];

  const renderItem = ({ item }: { item: [LanguageCode, string] }) => {
    const [code, name] = item;
    const isSelected = code === currentLanguage;
    
    return (
      <TouchableOpacity 
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => {
          onSelect(code);
          navigation.goBack();
        }}
      >
        <View style={styles.itemContent}>
          <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>{name}</Text>
          {isSelected && (
            <Ionicons name="checkmark" size={24} color="#6c5ce7" style={styles.checkmark} />
          )}
        </View>
        {!isSelected && <View style={styles.divider} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={languageEntries}
        renderItem={renderItem}
        keyExtractor={([code]) => code}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  listContent: {
    paddingTop: 8,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  itemSelected: {
    backgroundColor: '#f8f7ff',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 17,
    color: '#333',
  },
  itemTextSelected: {
    color: '#6c5ce7',
    fontWeight: '600',
  },
  checkmark: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 20,
    marginRight: 20,
  },
});