import Head from 'next/head'

export default props => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    {props.children}

  </div>
)
