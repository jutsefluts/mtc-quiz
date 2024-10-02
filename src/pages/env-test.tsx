import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      openaiKey: process.env.OPENAI_API_KEY || 'Not found',
    },
  }
}

export default function EnvTest({ openaiKey }: { openaiKey: string }) {
  return (
    <div>
      <h1>Environment Variable Test</h1>
      <p>OPENAI_API_KEY: {openaiKey}</p>
    </div>
  )
}
