import type { LoaderFunction } from 'remix'
import { redirect, Outlet, useMatches } from 'remix'
import { Step } from '~/components/step'
import { getSubscriptionActiveByUserId } from '~/models/subscription'
import { auth } from '~/services/auth.server'
import { classNames } from '~/utils/class-names'
import { STEPS } from '~/utils/constants'

export const loader: LoaderFunction = async ({ request }) => {
  const { id } = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  // Get the subscription data from user where status is active
  const subscription = await getSubscriptionActiveByUserId(id)
  if (subscription) {
    return redirect('/dashboard')
  }
  return true
}

export default function Purchase() {
  const { pathname } = useMatches()?.at(3) ?? {}
  const currentStepIdx = STEPS.findIndex((step) => step.pathname === pathname)

  return (
    <div className="py-4 px-4 sm:px-6 md:px-0">
      <div className="pb-4 sm:pt-7 md:pb-0 md:w-64 md:flex-col md:fixed">
        <nav aria-label="Progress">
          <ol className="overflow-hidden">
            {STEPS.map((step, stepIdx) => (
              <li
                key={step.name}
                className={classNames(
                  stepIdx !== STEPS.length - 1 ? 'pb-10' : '',
                  'relative'
                )}
              >
                <Step
                  step={step}
                  status={
                    stepIdx < currentStepIdx
                      ? 'completed'
                      : stepIdx === currentStepIdx
                      ? 'current'
                      : 'upcoming'
                  }
                  isLastStep={stepIdx !== STEPS.length - 1}
                />
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="md:pl-64">
        <Outlet />
      </div>
    </div>
  )
}
