import { Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { User, Group } from "../../../interfaces";

interface Props {
    usersOrGroups: User[] | Group[] ;
}

export const UserOrGroupList: FC<Props> = ({ usersOrGroups }) => {
    const t = useTranslations("Publication");
  return (
    <Grid container spacing={4}>
        {
            usersOrGroups.map( usersOrGroup => (
                <ProductCard 
                    key={ product.slug }
                    product={ product }
                />
            ))
        }
    </Grid>
  )
}