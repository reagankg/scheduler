<template>
    <q-card flat bordered class="calendar-skeleton">

        <div class="skeleton-scroll">

            <!-- HEADER -->
            <div class="skeleton-header">

                <div class="skeleton-technician-header">
                    <q-skeleton
                        type="text"
                        width="80px"
                    />
                </div>

                <div
                    v-for="day in 7"
                    :key="day"
                    class="skeleton-day-header"
                >
                    <q-skeleton
                        type="text"
                        width="45px"
                    />

                    <q-skeleton
                        type="text"
                        width="20px"
                    />
                </div>

            </div>


            <!-- BODY -->
            <div
                v-for="row in 5"
                :key="row"
                class="skeleton-row"
            >

                <!-- TECHNICIAN -->
                <div class="skeleton-technician-cell">

                    <q-skeleton
                        type="QAvatar"
                        size="36px"
                    />

                    <div class="skeleton-tech-info">

                        <q-skeleton
                            type="text"
                            width="100px"
                        />

                        <q-skeleton
                            type="text"
                            width="85px"
                        />

                        <q-skeleton
                            type="text"
                            width="90px"
                        />

                    </div>

                </div>


                <!-- DAYS -->
                <div
                    v-for="day in 7"
                    :key="day"
                    class="skeleton-day-cell"
                >

                    <q-skeleton
                        type="rect"
                        width="80px"
                        height="12px"
                    />

                </div>

            </div>

        </div>

    </q-card>
</template>


<style scoped>

.calendar-skeleton {
    border-radius: 10px;
    height: 560px;
    display: flex;
    flex-direction: column;
}

.skeleton-scroll {
    flex: 1;
    overflow: hidden;
    min-height: 0;
}


/* HEADER */

.skeleton-header {
    display: grid;
    grid-template-columns: 220px repeat(7, 140px);

    width: max-content;

    height: 68px;

    border-bottom: 2px solid #d1d5db;
    background: white;
}

.skeleton-technician-header {
    display: flex;
    align-items: center;
    justify-content: center;

    border-right: 1px solid #f3f4f6;
}

.skeleton-day-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 4px;

    border-left: 1px solid #f3f4f6;
}


/* ROW */

.skeleton-row {
    display: grid;

    grid-template-columns: 220px repeat(7, 140px);

    width: max-content;

    min-height: 110px;

    border-bottom: 1px solid #f3f4f6;
}


/* TECHNICIAN */

.skeleton-technician-cell {
    display: flex;
    align-items: center;

    gap: 10px;

    padding: 10px;

    border-right: 1px solid #f3f4f6;
}

.skeleton-tech-info {
    flex: 1;

    display: flex;
    flex-direction: column;

    gap: 2px;
}


/* DAYS */

.skeleton-day-cell {
    display: flex;
    align-items: center;
    justify-content: center;

    border-left: 1px solid #f3f4f6;
}

</style>