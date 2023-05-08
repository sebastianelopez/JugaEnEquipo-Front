import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { MainLayout } from "../../layouts";
import { Box, Typography } from "@mui/material";
import { User, Group } from "../../interfaces";
import { UserOrGroupList } from "../../components/organisms";

interface Props {
  usersOrGroups: User[] | Group[];
  foundUserOrGroup: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({
  usersOrGroups,
  foundUserOrGroup,
  query,
}) => {
  return (
    <MainLayout
      title={"Juga en Equipo - Search"}
      pageDescription={"Encuentra a jugadores o a tu equipo"}
    >
      <Typography variant="h1" component={"h1"}>
        Buscar usuario o grupo
      </Typography>
      {foundUserOrGroup ? (
        <Typography
          variant="h2"
          sx={{
            mb: 1,
          }}
          textTransform="capitalize"
        >
          {query}
        </Typography>
      ) : (
        <Box display={"flex"} component="div">
          <Typography
            variant="h2"
            sx={{
              mb: 1,
            }}
          >
            No encontramos ningun producto
          </Typography>
          <Typography
            variant="h2"
            sx={{
              ml: 1,
            }}
            color="secondary"
            textTransform="capitalize"
          >
            {query}
          </Typography>
        </Box>
      )}
      {<UserOrGroupList usersOrGroups={usersOrGroups} />} //TODO:
    </MainLayout>
  );
};

export default SearchPage;

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  let usersOrGroup = await getProductsByTerm(query);

  const foundUsersOrGroup = usersOrGroup.length > 0;

  if (!foundUsersOrGroup) {
    usersOrGroup = await dbProducts.getAllProducts();
  }
  //TODO: retornar otros productos

  return {
    props: {
      usersOrGroup,
      foundUsersOrGroup,
      query,
    },
  };
};
