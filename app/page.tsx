import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Who am I?
      </h1>
      <p className="mb-4">
        My name is <span className="font-semibold">Dimas Mufid</span>. I'm an
        engineer with a passion for building products that help people do more
        with their data.
        I believe that data is a powerful tool for making better decisions, and
        you don't have to have a full-time team to get started.
      </p>
      <p className="mb-4">
        Here it is, I hope I can help you with your journey in building data
        driven culture into your organization. Talk to me if you want to know
        more.
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
