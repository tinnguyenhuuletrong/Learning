import { useDataProvider } from "@ra-data-prisma/dataprovider";
import {
  Admin,
  Resource,
  Datagrid,
  List,
  Show,
  TextField,
  DateField,
  ShowButton,
  SimpleShowLayout,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";

const UserList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="email" />
      <DateField source="birthDate" />
      <ShowButton />
    </Datagrid>
  </List>
);

const UserShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="email" />
      <DateField source="birthDate" />
      <ReferenceArrayField label="Post" reference="Post" source="posts">
        <Datagrid>
          <TextField source="id" />
        </Datagrid>
      </ReferenceArrayField>
    </SimpleShowLayout>
  </Show>
);

const PostList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceArrayField label="Users" reference="User" source="authors">
        <SingleFieldList>
          <ChipField source="email" />
        </SingleFieldList>
      </ReferenceArrayField>
    </Datagrid>
  </List>
);

function App() {
  const dataProvider = useDataProvider({
    clientOptions: { uri: "http://localhost:4000/graphql" },
  });
  if (!dataProvider) {
    return <div>Loading</div>;
  }
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="User" list={UserList} show={UserShow} />
      <Resource name="Post" list={PostList} />
    </Admin>
  );
}

export default App;
