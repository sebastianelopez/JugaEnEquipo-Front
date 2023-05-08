import { Box, Grid, Typography } from "@mui/material"
import Scene from "../../three/Scene"

export const HomeHeader=()=>{

    return (
    <Box component="div"
      sx={{
        background: '#f5f5f5',
        padding: '30px 0',
        height: "calc(100vh - 60px)"
      }}
    >
      <Grid container display="flex" height={'100%'}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            paddingRight: { xs: 0, md: '20px' },
          }}
          display="flex"
          justifyContent={'center'}
          alignItems="center"
          flexDirection="column"
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontSize: { xs: '36px', md: '48px' },
              marginBottom: '20px',
            }}
            display="block"
          >
            Título de mi sitio web
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ marginBottom: '10px' }}
            display="block"
          >
            Subtítulo del sitio web
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ marginBottom: '30px' }}
            display="block"
          >
            Descripción breve del sitio web. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} >
          <Scene />          
        </Grid>
      </Grid>
    </Box>
    )
}